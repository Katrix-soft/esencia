// db/seed.js — Datos iniciales para desarrollo y testing
// Inserta la tienda de demostración y productos de ejemplo si no existen.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const knex   = require('./knex');
const logger = require('../lib/logger');

async function seed() {
  logger.info('Ejecutando seed de base de datos...');

  // Verificar si ya existe la tienda de demo
  const existing = await knex('stores').where({ slug: 'esencia' }).first();
  if (existing) {
    logger.info('Seed ya aplicado. Tienda "esencia" ya existe.');
    return;
  }

  const passwordHash = await bcrypt.hash('Esencia_Demo_2026', 12);

  await knex('stores').insert({
    slug:           'esencia',
    name:           'Esencia Perfumes',
    email:          'nachin@katrix.com.ar',
    password_hash:  passwordHash,
    description:    'Perfumería de autor y decants exclusivos.',
    phone:          '+54 9 11 1234-5678',
    address:        'Av. Santa Fe 1234, CABA',
    store_url:      'http://esencia.katrix.com.ar',
    plan_id:        'flor',
    payment_status: 'paid',
  });

  await knex('products').insert([
    {
      store_slug: 'esencia',
      name:       'Acqua di Gio',
      brand:      'Giorgio Armani',
      category:   'Cítrico',
      price:      145000,
      stock:      12,
      volume:     '100ml',
    },
    {
      store_slug: 'esencia',
      name:       'Bleu de Chanel',
      brand:      'Chanel',
      category:   'Amaderado',
      price:      185000,
      stock:      8,
      volume:     '50ml',
    },
  ]);

  logger.info('Seed completado exitosamente. Tienda "esencia" creada con 2 productos.');
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error('Error en seed:', { error: err.message });
      process.exit(1);
    });
}

module.exports = { seed };

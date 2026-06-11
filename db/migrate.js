// db/migrate.js — Runner de migraciones automático
// Se ejecuta al arrancar el servidor (y en el Dockerfile).
// Aplica solo las migraciones pendientes (idempotente).
require('dotenv').config();
const path = require('path');
const knex = require('./knex');
const logger = require('../lib/logger');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function runMigrations() {
  try {
    logger.info('Ejecutando migraciones de base de datos...');

    await knex.migrate.latest({
      directory: MIGRATIONS_DIR,
      loadExtensions: ['.js'],
    });

    const [batchNo, applied] = await knex.migrate.list({ directory: MIGRATIONS_DIR });
    
    if (applied && applied.length > 0) {
      logger.info(`Migraciones aplicadas: ${applied.map(m => m.name || m).join(', ')}`);
    } else {
      logger.info('Base de datos al día. No hay migraciones pendientes.');
    }

  } catch (err) {
    logger.error('Error al ejecutar migraciones.', { error: err.message, stack: err.stack });
    throw err;
  }
}

// Si se ejecuta directamente (node db/migrate.js)
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migraciones completadas exitosamente.');
      process.exit(0);
    })
    .catch(() => process.exit(1));
}

module.exports = { runMigrations };

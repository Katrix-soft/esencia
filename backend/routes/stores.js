// routes/stores.js — CRUD de tiendas contra PostgreSQL
const express  = require('express');
const crypto   = require('crypto');
const bcrypt   = require('bcryptjs');
const knex     = require('../db/knex');
const logger   = require('../lib/logger');
const { authMiddleware, requireStoreOwnership } = require('../middleware/auth');
const { validate }                              = require('../middleware/validate');
const { storeLimiter, writeLimiter }            = require('../middleware/storeLimiter');
const { sendPasswordEmail, sendWelcomeEmail }   = require('../lib/mailer');
const { dispatch }                              = require('../lib/webhooks');
const { createStoreSchema, updateStoreSchema, changePasswordSchema } = require('../schemas/store.schema');

const router = express.Router();

// Helper: mapear row de DB al formato de respuesta
function storeToResponse(store) {
  return {
    slug:          store.slug,
    name:          store.name,
    email:         store.email,
    description:   store.description,
    phone:         store.phone,
    address:       store.address,
    storeUrl:      store.store_url,
    planId:        store.plan_id,
    paymentStatus: store.payment_status,
    visitCount:    store.visit_count,
    createdAt:     store.created_at,
  };
}

// Helper: verificar si una tienda está activa (bloqueo día 15)
function checkStoreStatus(store) {
  const day = new Date().getDate();
  if (day > 15 && store.payment_status === 'unpaid') {
    return {
      active: false,
      reason: 'Tu tienda ha sido deshabilitada temporalmente por falta de pago. Tenés del 1 al 15 de cada mes para abonar el servicio de Esencia.',
    };
  }
  return { active: true };
}

// =====================================================
// GET /stores/:slug — Obtener tienda pública
// =====================================================
router.get('/:slug', storeLimiter, async (req, res) => {
  try {
    const store = await knex('stores').where({ slug: req.params.slug }).first();
    if (!store) return res.status(404).json({ error: 'Tienda no encontrada.' });

    const status = checkStoreStatus(store);
    if (!status.active) return res.status(402).json({ error: 'Pago requerido', message: status.reason });

    // Contar visita
    await knex('stores').where({ slug: store.slug }).increment('visit_count', 1);

    res.json(storeToResponse(store));
  } catch (err) {
    logger.error('Error al obtener tienda.', { slug: req.params.slug, error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// POST /stores — Crear/provisionar una nueva tienda (Admin)
// =====================================================
router.post('/', authMiddleware, validate(createStoreSchema), async (req, res) => {
  const { slug, name, email, description, phone, address, plan_id } = req.body;

  try {
    const existing = await knex('stores').where({ slug }).orWhere({ email }).first();
    if (existing) {
      return res.status(409).json({ error: 'El slug o email ya está registrado.' });
    }

    const tempPassword = 'Esencia_' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const [store] = await knex('stores').insert({
      slug,
      name,
      email,
      password_hash:  passwordHash,
      description:    description || '',
      phone:          phone       || '',
      address:        address     || '',
      store_url:      `http://${slug}.katrix.com.ar`,
      plan_id:        plan_id     || 'semilla',
      payment_status: 'paid',
    }).returning('*');

    logger.info('Nueva tienda creada.', { slug, email });

    // Enviar email de bienvenida con la contraseña temporal
    await sendWelcomeEmail(email, name, tempPassword, store.store_url);

    res.status(201).json({
      store:         storeToResponse(store),
      tempPassword,  // Solo se incluye en la respuesta al crear — no se guarda en texto plano
    });
  } catch (err) {
    logger.error('Error al crear tienda.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// PUT /stores/:slug — Actualizar datos de la tienda (owner o admin)
// =====================================================
router.put('/:slug', authMiddleware, requireStoreOwnership, writeLimiter, validate(updateStoreSchema), async (req, res) => {
  try {
    const store = await knex('stores').where({ slug: req.params.slug }).first();
    if (!store) return res.status(404).json({ error: 'Tienda no encontrada.' });

    const [updated] = await knex('stores')
      .where({ slug: req.params.slug })
      .update({ ...req.body, updated_at: new Date() })
      .returning('*');

    logger.info('Tienda actualizada.', { slug: req.params.slug });
    res.json(storeToResponse(updated));
  } catch (err) {
    logger.error('Error al actualizar tienda.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// POST /stores/:slug/change-password — Cambiar contraseña (owner o admin)
// =====================================================
router.post('/:slug/change-password', authMiddleware, requireStoreOwnership, writeLimiter, validate(changePasswordSchema), async (req, res) => {
  try {
    const store = await knex('stores').where({ slug: req.params.slug }).first();
    if (!store) return res.status(404).json({ error: 'Tienda no encontrada.' });

    const newPassword  = req.body.password || 'Esencia_' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await knex('stores').where({ slug: req.params.slug }).update({ password_hash: passwordHash, updated_at: new Date() });

    const emailSent = await sendPasswordEmail(store.email, store.name, newPassword);

    logger.info('Contraseña actualizada.', { slug: req.params.slug, emailSent });
    res.json({ message: 'Contraseña actualizada correctamente.', emailSent });
  } catch (err) {
    logger.error('Error al cambiar contraseña.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// GET /stores/:slug/webhooks — Listar webhooks de una tienda
// =====================================================
router.get('/:slug/webhooks', authMiddleware, requireStoreOwnership, async (req, res) => {
  try {
    const webhooks = await knex('store_webhooks').where({ store_slug: req.params.slug });
    res.json(webhooks);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// POST /stores/:slug/webhooks — Registrar webhook saliente
// =====================================================
const { validate: v } = require('../middleware/validate');
const { createWebhookSchema } = require('../schemas/store.schema');

router.post('/:slug/webhooks', authMiddleware, requireStoreOwnership, v(createWebhookSchema), async (req, res) => {
  try {
    const { url, events } = req.body;
    const [wh] = await knex('store_webhooks').insert({
      store_slug: req.params.slug,
      url,
      events: events || ['payment.paid', 'payment.overdue'],
    }).returning('*');

    logger.info('Webhook registrado.', { slug: req.params.slug, url });
    res.status(201).json(wh);
  } catch (err) {
    logger.error('Error al registrar webhook.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = { router, checkStoreStatus, storeToResponse };

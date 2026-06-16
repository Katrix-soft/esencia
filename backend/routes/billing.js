// routes/billing.js — Gestión de facturación, suspensiones y estados de pago
const express  = require('express');
const knex     = require('../db/knex');
const logger   = require('../lib/logger');
const { authMiddleware } = require('../middleware/auth');
const { validate }       = require('../middleware/validate');
const { billingSchema }  = require('../schemas/store.schema');
const { dispatch }       = require('../lib/webhooks');
const { storeToResponse } = require('./stores');

const router = express.Router();

// =====================================================
// GET /stores/:slug/billing — Obtener estado de facturación (admin o owner)
// =====================================================
router.get('/:slug/billing', authMiddleware, async (req, res) => {
  try {
    const store = await knex('stores')
      .select('slug', 'name', 'email', 'plan_id', 'payment_status', 'created_at')
      .where({ slug: req.params.slug })
      .first();

    if (!store) return res.status(404).json({ error: 'Tienda no encontrada.' });

    const today       = new Date().getDate();
    const daysUntil15 = today <= 15 ? 15 - today : 0;
    const isSuspended  = today > 15 && store.payment_status === 'unpaid';

    res.json({
      slug:           store.slug,
      name:           store.name,
      email:          store.email,
      planId:         store.plan_id,
      paymentStatus:  store.payment_status,
      isSuspended,
      daysUntilDeadline: daysUntil15,
      message: isSuspended
        ? '⚠️ Tienda suspendida por falta de pago. Regularizá antes de continuar.'
        : daysUntil15 > 0
          ? `✅ Tenés ${daysUntil15} días para regularizar tu abono mensual.`
          : '✅ Abono al día.',
    });
  } catch (err) {
    logger.error('Error al obtener facturación.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// PUT /stores/:slug/billing — Actualizar estado de pago (solo admin del sistema)
// =====================================================
router.put('/:slug/billing', authMiddleware, validate(billingSchema), async (req, res) => {
  // Solo el sistema (API_IA) puede cambiar el estado de pago
  if (!req.isAdmin) {
    return res.status(403).json({
      error: 'Acceso denegado',
      message: 'Solo el sistema puede modificar el estado de facturación.',
    });
  }

  try {
    const { paymentStatus } = req.body;
    const store = await knex('stores').where({ slug: req.params.slug }).first();
    if (!store) return res.status(404).json({ error: 'Tienda no encontrada.' });

    const wasUnpaid = store.payment_status === 'unpaid';

    await knex('stores').where({ slug: req.params.slug }).update({
      payment_status: paymentStatus,
      updated_at:     new Date(),
    });

    logger.info('Estado de facturación actualizado.', { slug: req.params.slug, paymentStatus });

    // Despachar webhook saliente según el nuevo estado
    if (paymentStatus === 'paid' && wasUnpaid) {
      await dispatch(req.params.slug, 'store.reactivated', { slug: req.params.slug, paymentStatus });
    } else if (paymentStatus === 'unpaid') {
      await dispatch(req.params.slug, 'store.suspended', { slug: req.params.slug, paymentStatus });
    }

    const updated = await knex('stores').where({ slug: req.params.slug }).first();
    res.json({ message: 'Estado de facturación actualizado.', store: storeToResponse(updated) });
  } catch (err) {
    logger.error('Error al actualizar facturación.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;

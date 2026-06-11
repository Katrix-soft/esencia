// routes/stats.js — Estadísticas por tienda para el dashboard
const express = require('express');
const knex    = require('../db/knex');
const logger  = require('../lib/logger');
const { authMiddleware, requireStoreOwnership } = require('../middleware/auth');

const router = express.Router();

// =====================================================
// GET /stores/:slug/stats — Estadísticas del dashboard (owner o admin)
// =====================================================
router.get('/:slug/stats', authMiddleware, requireStoreOwnership, async (req, res) => {
  try {
    const store = await knex('stores').where({ slug: req.params.slug }).first();
    if (!store) return res.status(404).json({ error: 'Tienda no encontrada.' });

    // Estadísticas de productos
    const products    = await knex('products').where({ store_slug: req.params.slug });
    const totalProducts    = products.length;
    const outOfStock       = products.filter(p => p.stock === 0).length;
    const totalInventory   = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const avgPrice         = totalProducts > 0
      ? products.reduce((acc, p) => acc + Number(p.price), 0) / totalProducts
      : 0;

    // Categorías únicas
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    // Estado de pago y días restantes
    const today            = new Date().getDate();
    const daysUntilDeadline = today <= 15 ? 15 - today : 0;
    const isSuspended       = today > 15 && store.payment_status === 'unpaid';

    // Webhooks activos
    const webhookCount = await knex('store_webhooks')
      .where({ store_slug: req.params.slug, active: true })
      .count('id as count')
      .first();

    res.json({
      slug:             store.slug,
      name:             store.name,
      planId:           store.plan_id,
      paymentStatus:    store.payment_status,
      isSuspended,
      daysUntilDeadline,
      visitCount:       store.visit_count || 0,
      products: {
        total:          totalProducts,
        outOfStock,
        inStock:        totalProducts - outOfStock,
        totalInventory,
        avgPrice:       Math.round(avgPrice),
        categories,
      },
      webhooksActive:   Number(webhookCount?.count || 0),
      generatedAt:      new Date().toISOString(),
    });
  } catch (err) {
    logger.error('Error al generar estadísticas.', { slug: req.params.slug, error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;

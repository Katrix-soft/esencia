// routes/products.js — CRUD de productos contra PostgreSQL
const express = require('express');
const knex    = require('../db/knex');
const logger  = require('../lib/logger');
const { authMiddleware, requireStoreOwnership } = require('../middleware/auth');
const { validate }                              = require('../middleware/validate');
const { storeLimiter, writeLimiter }            = require('../middleware/storeLimiter');
const { createProductSchema, updateProductSchema } = require('../schemas/store.schema');
const { checkStoreStatus } = require('./stores');

const router = express.Router({ mergeParams: true }); // Para acceder a :slug del padre

// =====================================================
// GET /stores/:slug/products — Listar productos (público, con filtros)
// =====================================================
router.get('/', storeLimiter, async (req, res) => {
  try {
    const store = await knex('stores').where({ slug: req.params.slug }).first();
    if (!store) return res.status(404).json({ error: 'Tienda no encontrada.' });

    const status = checkStoreStatus(store);
    if (!status.active) return res.status(402).json({ error: 'Pago requerido', message: status.reason });

    let query = knex('products').where({ store_slug: req.params.slug });

    if (req.query.category) query = query.where({ category: req.query.category });
    if (req.query.inStock === 'true') query = query.where('stock', '>', 0);
    if (req.query.brand) query = query.where({ brand: req.query.brand });
    if (req.query.search) {
      const q = `%${req.query.search}%`;
      query = query.where((b) => b.whereLike('name', q).orWhereLike('brand', q));
    }

    const products = await query.orderBy('created_at', 'desc');
    res.json(products);
  } catch (err) {
    logger.error('Error al listar productos.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// GET /stores/:slug/products/:productId — Obtener un producto
// =====================================================
router.get('/:productId', storeLimiter, async (req, res) => {
  try {
    const product = await knex('products')
      .where({ id: req.params.productId, store_slug: req.params.slug })
      .first();

    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// POST /stores/:slug/products — Crear producto (owner o admin)
// =====================================================
router.post('/', authMiddleware, requireStoreOwnership, writeLimiter, validate(createProductSchema), async (req, res) => {
  try {
    const store = await knex('stores').where({ slug: req.params.slug }).first();
    if (!store) return res.status(404).json({ error: 'Tienda no encontrada.' });

    const [product] = await knex('products')
      .insert({ ...req.body, store_slug: req.params.slug })
      .returning('*');

    logger.info('Producto creado.', { slug: req.params.slug, name: req.body.name });
    res.status(201).json(product);
  } catch (err) {
    logger.error('Error al crear producto.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// PUT /stores/:slug/products/:productId — Actualizar producto
// =====================================================
router.put('/:productId', authMiddleware, requireStoreOwnership, writeLimiter, validate(updateProductSchema), async (req, res) => {
  try {
    const [updated] = await knex('products')
      .where({ id: req.params.productId, store_slug: req.params.slug })
      .update({ ...req.body, updated_at: new Date() })
      .returning('*');

    if (!updated) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json(updated);
  } catch (err) {
    logger.error('Error al actualizar producto.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// DELETE /stores/:slug/products/:productId — Eliminar producto
// =====================================================
router.delete('/:productId', authMiddleware, requireStoreOwnership, writeLimiter, async (req, res) => {
  try {
    const deleted = await knex('products')
      .where({ id: req.params.productId, store_slug: req.params.slug })
      .delete();

    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.status(204).send();
  } catch (err) {
    logger.error('Error al eliminar producto.', { error: err.message });
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;

// api.js — Router principal: importa y monta todas las rutas modulares
// Este archivo ya no contiene lógica de negocio — solo orquesta.
const express       = require('express');
const swaggerUi     = require('swagger-ui-express');
const { spec: swaggerSpecOriginal, PLANS } = require('./swagger-spec');

// Rutas modulares
const authRouter     = require('./routes/auth');
const plansRouter    = require('./routes/plans');
const { router: storesRouter } = require('./routes/stores');
const productsRouter = require('./routes/products');
const billingRouter  = require('./routes/billing');
const statsRouter    = require('./routes/stats');

// Infraestructura
const knex    = require('./db/knex');
const logger  = require('./lib/logger');
const { cleanExpiredTokens } = require('./lib/jwt');
const { runMigrations }      = require('./db/migrate');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');

const router = express.Router();

// Clonar spec para modificar en tiempo de ejecución
const swaggerSpec = JSON.parse(JSON.stringify(swaggerSpecOriginal));

if (process.env.NODE_ENV === 'production') {
  swaggerSpec.servers.sort((a, b) => {
    if (a.url.includes('localhost')) return 1;
    if (b.url.includes('localhost')) return -1;
    return 0;
  });
}

// ============================================================
// SWAGGER UI
// ============================================================
const swaggerOptions = {
  customCss: `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    :root {
      --bg-primary: #0a0a0f; --bg-secondary: #12121a; --bg-tertiary: #161622;
      --bg-card: #1c1c28; --border-color: #2a2a3e;
      --text-main: #e2e2e9; --text-muted: #8e8ea8;
      --text-highlight: #d4af37; --brand-green: #2d6a4f; --brand-green-light: #4ade80;
    }
    body { background-color: var(--bg-primary) !important; margin: 0; }
    .swagger-ui { font-family: 'Outfit', sans-serif !important; background-color: var(--bg-primary) !important; color: var(--text-main) !important; }
    .swagger-ui .topbar { background-color: var(--bg-primary) !important; border-bottom: 1px solid var(--border-color) !important; padding: 18px 0 !important; }
    .swagger-ui .topbar-wrapper { padding: 0 20px; }
    .swagger-ui .topbar-wrapper .link { font-family: 'Outfit', sans-serif; color: var(--text-highlight) !important; font-size: 1.2em; font-weight: 700; }
    .swagger-ui .info { background: var(--bg-secondary); padding: 24px; border-radius: 12px; border: 1px solid var(--border-color); }
    .swagger-ui .info .title { color: var(--text-highlight) !important; }
    .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info td { color: var(--text-main) !important; }
    .swagger-ui .opblock { background: var(--bg-card) !important; border: 1px solid var(--border-color) !important; border-radius: 8px !important; margin-bottom: 8px; }
    .swagger-ui .opblock-summary { background: transparent !important; }
    .swagger-ui .opblock-summary-method { border-radius: 6px !important; font-weight: 700 !important; }
    .swagger-ui .opblock-summary-description, .swagger-ui .opblock-summary-path { color: var(--text-main) !important; }
    .swagger-ui .btn.execute { background: var(--brand-green) !important; border-color: var(--brand-green-light) !important; color: white !important; border-radius: 6px !important; }
    .swagger-ui .responses-wrapper, .swagger-ui .request-url, .swagger-ui .response-col_status { color: var(--text-main) !important; }
  `,
  customSiteTitle: 'Esencia API Docs',
};

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// ============================================================
// HEALTH CHECK
// ============================================================
router.get('/health', async (req, res) => {
  try {
    await knex.raw('SELECT 1');
    res.json({
      status:    'healthy',
      database:  'postgresql (connected)',
      timestamp: new Date().toISOString(),
      uptime:    `${Math.floor(process.uptime())}s`,
    });
  } catch (err) {
    res.status(503).json({
      status:   'degraded',
      database: 'postgresql (disconnected)',
      error:    err.message,
    });
  }
});

// ============================================================
// CONFIG (public key MP)
// ============================================================
router.get('/config', (req, res) => {
  res.json({
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
    plans:     PLANS,
  });
});

// ============================================================
// RUTAS MODULARES
// ============================================================
router.use('/auth',        authRouter);
router.use('/plans',       plansRouter);
router.use('/stores',      storesRouter);
router.use('/stores',      productsRouter);  // /stores/:slug/products
router.use('/stores',      billingRouter);   // /stores/:slug/billing
router.use('/stores',      statsRouter);     // /stores/:slug/stats

// ============================================================
// PROVISIONING (llamado desde server.js post-pago)
// Mantiene compatibilidad con el flujo de Mercado Pago existente
// ============================================================
const bcrypt = require('bcryptjs');
const { sendWelcomeEmail } = require('./lib/mailer');

router.provisionStore = async function(slug, name, email, products) {
  try {
    const tempPassword = 'Esencia_' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const existing = await knex('stores').where({ slug }).orWhere({ email }).first();
    if (existing) {
      logger.warn('provisionStore: tienda ya existe.', { slug });
      return existing;
    }

    const [store] = await knex('stores').insert({
      slug,
      name,
      email,
      password_hash:  passwordHash,
      store_url:      `http://${slug}.katrix.com.ar`,
      payment_status: 'paid',
      plan_id:        'semilla',
    }).returning('*');

    // Insertar productos iniciales si se pasan
    if (products && products.length > 0) {
      await knex('products').insert(products.map(p => ({ ...p, store_slug: slug })));
    }

    await sendWelcomeEmail(email, name, tempPassword, store.store_url);
    logger.info('Tienda aprovisionada desde pago.', { slug, email });

    return store;
  } catch (err) {
    logger.error('Error en provisionStore.', { error: err.message });
    throw err;
  }
};

// Exportar spec para que server.js pueda accederlo
router.swaggerSpec = swaggerSpec;
router.PLANS       = PLANS;

// ============================================================
// INICIALIZACIÓN: Migraciones y limpieza de tokens
// ============================================================
async function initializeDB() {
  try {
    await runMigrations();
    await cleanExpiredTokens();
    logger.info('Base de datos inicializada correctamente.');
  } catch (err) {
    logger.error('Error al inicializar la base de datos.', { error: err.message });
    // No lanzar error — el servidor puede arrancar sin PG en dev
  }
}

initializeDB();

module.exports = router;

const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const { spec: swaggerSpecOriginal, PLANS } = require('./swagger-spec');

const router = express.Router();

// Clonar especificación para modificar en tiempo de ejecución
const swaggerSpec = JSON.parse(JSON.stringify(swaggerSpecOriginal));

// En producción, reordenar los servidores para priorizar el HTTPS de producción
if (process.env.NODE_ENV === 'production') {
  swaggerSpec.servers.sort((a, b) => {
    if (a.url.includes('localhost')) return 1;
    if (b.url.includes('localhost')) return -1;
    return 0;
  });
}

// ============================================================
// DOCUMENTACIÓN INTERACTIVA (Swagger UI)
// ============================================================
const swaggerOptions = {
  customCss: `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    /* Variables del tema oscuro premium */
    :root {
      --bg-primary: #0a0a0f;
      --bg-secondary: #12121a;
      --bg-tertiary: #161622;
      --bg-card: #1c1c28;
      --border-color: #2a2a3e;
      --text-main: #e2e2e9;
      --text-muted: #8e8ea8;
      --text-highlight: #d4af37; /* Dorado */
      --brand-green: #2d6a4f;
      --brand-green-light: #4ade80;
    }

    body {
      background-color: var(--bg-primary) !important;
      margin: 0;
    }

    /* Fuente general */
    .swagger-ui {
      font-family: 'Outfit', sans-serif !important;
      background-color: var(--bg-primary) !important;
      color: var(--text-main) !important;
    }

    /* Topbar moderna */
    .swagger-ui .topbar {
      background-color: var(--bg-primary) !important;
      border-bottom: 1px solid var(--border-color) !important;
      padding: 18px 0 !important;
    }
    .swagger-ui .topbar .download-url-wrapper { 
      display: none !important; 
    }
    .swagger-ui .topbar a span {
      color: var(--text-main) !important;
      font-weight: 700 !important;
      font-size: 1.3rem !important;
      letter-spacing: 0.05em !important;
      text-transform: uppercase;
      font-family: 'Outfit', sans-serif !important;
    }

    /* Contenedor de Información */
    .swagger-ui .info {
      margin: 45px 0 !important;
    }
    .swagger-ui .info .title {
      color: #ffffff !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 700 !important;
      font-size: 2.8rem !important;
      letter-spacing: -0.03em !important;
    }
    .swagger-ui .info p, 
    .swagger-ui .info li, 
    .swagger-ui .info td,
    .swagger-ui .info .markdown {
      color: var(--text-muted) !important;
      font-size: 1.05rem !important;
      line-height: 1.7 !important;
    }
    .swagger-ui .info .markdown code {
      background-color: var(--bg-tertiary) !important;
      color: var(--text-highlight) !important;
      border: 1px solid var(--border-color) !important;
      padding: 3px 7px !important;
      border-radius: 6px !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 0.9em !important;
    }
    .swagger-ui .info pre {
      background-color: var(--bg-secondary) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 10px !important;
      padding: 20px !important;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.5) !important;
    }

    /* Links */
    .swagger-ui a {
      color: var(--brand-green-light) !important;
      transition: color 0.2s ease !important;
    }
    .swagger-ui a:hover {
      color: #ffffff !important;
    }

    /* Esquema y Servidores */
    .swagger-ui .scheme-container {
      background-color: var(--bg-secondary) !important;
      border: 1px solid var(--border-color) !important;
      box-shadow: 0 15px 35px rgba(0,0,0,0.4) !important;
      border-radius: 14px !important;
      padding: 24px !important;
      margin-bottom: 35px !important;
    }
    .swagger-ui .servers-title {
      color: #ffffff !important;
      font-weight: 600 !important;
    }
    .swagger-ui select {
      background-color: var(--bg-tertiary) !important;
      color: var(--text-main) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 8px !important;
      padding: 8px 14px !important;
      font-family: 'Outfit', sans-serif !important;
      cursor: pointer;
    }

    /* Botón Autorizar */
    .swagger-ui .btn.authorize {
      background: linear-gradient(135deg, var(--brand-green), #1b4332) !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 8px !important;
      padding: 8px 22px !important;
      font-weight: 600 !important;
      font-family: 'Outfit', sans-serif !important;
      box-shadow: 0 4px 15px rgba(45, 106, 79, 0.4) !important;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .swagger-ui .btn.authorize:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 22px rgba(45, 106, 79, 0.6) !important;
    }
    .swagger-ui .btn.authorize svg {
      fill: #ffffff !important;
    }

    /* Contenedor de Endpoints (Tags) */
    .swagger-ui .opblock-tag-section {
      background-color: var(--bg-secondary) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 14px !important;
      padding: 15px !important;
      margin-bottom: 25px !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
    }
    .swagger-ui .opblock-tag {
      border-bottom: 1px solid var(--border-color) !important;
      padding-bottom: 10px !important;
      font-size: 1.4rem !important;
      color: #ffffff !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 600 !important;
    }
    .swagger-ui .opblock-tag small {
      color: var(--text-muted) !important;
      font-size: 0.95rem !important;
    }

    /* Bloques de Operaciones (Endpoints) */
    .swagger-ui .opblock {
      border-radius: 10px !important;
      margin-bottom: 12px !important;
      border: 1px solid transparent !important;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15) !important;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .swagger-ui .opblock:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 8px 20px rgba(0,0,0,0.3) !important;
    }

    /* GET Block */
    .swagger-ui .opblock.opblock-get {
      background-color: #0f1a24 !important;
      border-color: #172d3f !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background-color: #2b77c5 !important;
      color: #ffffff !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary {
      border-color: #172d3f !important;
    }

    /* POST Block */
    .swagger-ui .opblock.opblock-post {
      background-color: #0d1e16 !important;
      border-color: #143525 !important;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background-color: #24754f !important;
      color: #ffffff !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary {
      border-color: #143525 !important;
    }

    /* PUT Block */
    .swagger-ui .opblock.opblock-put {
      background-color: #21190e !important;
      border-color: #3b2c15 !important;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background-color: #c9751d !important;
      color: #ffffff !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary {
      border-color: #3b2c15 !important;
    }

    /* DELETE Block */
    .swagger-ui .opblock.opblock-delete {
      background-color: #210e0e !important;
      border-color: #3b1515 !important;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background-color: #c92c2c !important;
      color: #ffffff !important;
      border-radius: 6px !important;
      font-weight: 700 !important;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary {
      border-color: #3b1515 !important;
    }

    /* Textos de Endpoint */
    .swagger-ui .opblock-summary-path {
      font-family: 'JetBrains Mono', monospace !important;
      color: #ffffff !important;
      font-size: 1.05rem !important;
    }
    .swagger-ui .opblock-summary-description {
      color: var(--text-muted) !important;
      font-family: 'Outfit', sans-serif !important;
      font-size: 0.95rem !important;
    }

    /* Cuerpo expandido de endpoints */
    .swagger-ui .opblock-body {
      background-color: #0c0c12 !important;
      border-radius: 0 0 10px 10px !important;
    }
    .swagger-ui .opblock-section-header {
      background-color: var(--bg-secondary) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 8px !important;
      padding: 10px !important;
    }
    .swagger-ui .opblock-section-header h4 {
      color: #ffffff !important;
      font-family: 'Outfit', sans-serif !important;
    }

    /* Inputs y Formularios de Parámetros */
    .swagger-ui input[type=text] {
      background-color: var(--bg-tertiary) !important;
      color: #ffffff !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 6px !important;
      padding: 8px 12px !important;
      font-family: 'JetBrains Mono', monospace !important;
    }
    .swagger-ui .btn.execute {
      background: linear-gradient(135deg, #106fbc, #0a497b) !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 8px !important;
      font-family: 'Outfit', sans-serif !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(16, 111, 188, 0.4) !important;
      transition: all 0.2s ease !important;
    }
    .swagger-ui .btn.execute:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 6px 16px rgba(16, 111, 188, 0.6) !important;
    }
    .swagger-ui .btn.btn-clear {
      border-radius: 8px !important;
      font-family: 'Outfit', sans-serif !important;
      color: var(--text-muted) !important;
      border-color: var(--border-color) !important;
    }

    /* Modelos/Esquemas al final */
    .swagger-ui section.models {
      border: 1px solid var(--border-color) !important;
      border-radius: 14px !important;
      background-color: var(--bg-secondary) !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
      padding: 15px !important;
    }
    .swagger-ui section.models h4 {
      color: #ffffff !important;
      font-family: 'Outfit', sans-serif !important;
      border-bottom: 1px solid var(--border-color) !important;
      padding-bottom: 10px !important;
      font-size: 1.3rem !important;
    }
    .swagger-ui .model-container {
      background-color: var(--bg-tertiary) !important;
      border: 1px solid var(--border-color) !important;
      border-radius: 8px !important;
      margin: 8px 0 !important;
    }
    .swagger-ui .model-box {
      background-color: transparent !important;
    }
    .swagger-ui .model-title {
      color: #ffffff !important;
      font-family: 'Outfit', sans-serif !important;
    }
    .swagger-ui .model {
      color: var(--text-muted) !important;
    }
    .swagger-ui .prop-name {
      color: #ffffff !important;
      font-family: 'JetBrains Mono', monospace !important;
    }
    .swagger-ui .prop-type {
      color: var(--brand-green-light) !important;
    }
  `,
  customSiteTitle: "Esencia API — Documentación"
};

// Servir la especificación OpenAPI en formato JSON
router.get('/spec.json', (req, res) => {
  res.json(swaggerSpec);
});

// Servir la interfaz interactiva de Swagger UI
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

// ============================================================
// RUTAS DE PLANES
// ============================================================
router.get('/plans', (req, res) => {
  res.json(PLANS);
});

router.get('/plans/:planId', (req, res) => {
  const plan = PLANS.find(p => p.id === req.params.planId);
  if (!plan) return res.status(404).json({ error: 'Plan no encontrado' });
  res.json(plan);
});

// ============================================================
// CONFIGURACION
// ============================================================
router.get('/config', (req, res) => {
  res.json({
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
    plans: PLANS
  });
});

// ============================================================
// HEALTH CHECK (Estado del sistema)
// ============================================================
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: fs.existsSync(DB_FILE) ? 'active (local json)' : 'initializing'
  });
});

// ============================================================
// PERSISTENCIA DE BASE DE DATOS (stores-db.json)
// ============================================================
const DB_DIR = process.env.DATA_DIR || __dirname;
const DB_FILE = path.join(DB_DIR, 'stores-db.json');
let storesDB = {};

function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      storesDB = JSON.parse(data);
    } else {
      storesDB = {};
      saveDB();
    }
  } catch (error) {
    console.error('Error al cargar la base de datos de producción:', error);
    storesDB = {};
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(storesDB, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al escribir en la base de datos de producción:', error);
  }
}

// Cargar la BD al iniciar el módulo
loadDB();

// ============================================================
// MIDDLEWARE DE AUTENTICACIÓN (Bearer JWT Stub para Prod)
// ============================================================
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'No autorizado',
      message: 'Se requiere un token Bearer en el header Authorization para acceder a este recurso administrativo.'
    });
  }
  // Para la demo, permitimos cualquier Bearer token.
  next();
}

// ============================================================
// TIENDAS (persistencia de datos local)
// ============================================================
router.get('/stores/:slug', (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  res.json(store);
});

router.put('/stores/:slug', authMiddleware, (req, res) => {
  const { slug } = req.params;
  if (!storesDB[slug]) return res.status(404).json({ error: 'Tienda no encontrada' });
  storesDB[slug] = { ...storesDB[slug], ...req.body };
  saveDB();
  res.json(storesDB[slug]);
});

// ============================================================
// PRODUCTOS (persistencia de datos local)
// ============================================================
router.get('/stores/:slug/products', (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  let products = store.products || [];
  if (req.query.category) products = products.filter(p => p.category === req.query.category);
  if (req.query.inStock === 'true') products = products.filter(p => p.stock > 0);
  res.json(products);
});

router.post('/stores/:slug/products', authMiddleware, (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  const product = { ...req.body, id: crypto.randomUUID() };
  store.products = [...(store.products || []), product];
  saveDB();
  res.status(201).json(product);
});

router.put('/stores/:slug/products/:productId', authMiddleware, (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  const idx = (store.products || []).findIndex(p => p.id === req.params.productId);
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });
  store.products[idx] = { ...store.products[idx], ...req.body };
  saveDB();
  res.json(store.products[idx]);
});

router.delete('/stores/:slug/products/:productId', authMiddleware, (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  store.products = (store.products || []).filter(p => p.id !== req.params.productId);
  saveDB();
  res.status(204).send();
});

// ============================================================
// PROVISIONING INTERNO (llamado desde server.js post-pago)
// ============================================================
router.provisionStore = function(slug, name, email, products) {
  storesDB[slug] = {
    slug,
    name,
    email,
    description: '',
    phone: '',
    address: '',
    storeUrl: `http://${slug}.katrix.com.ar`,
    products: products || []
  };
  saveDB();
  return storesDB[slug];
};

router.swaggerSpec = swaggerSpec;
router.PLANS = PLANS;

module.exports = router;



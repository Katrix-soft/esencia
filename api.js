const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const nodemailer = require('nodemailer');
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
  
  const token = authHeader.split(' ')[1];
  const apiSecret = process.env.WEBHOOK_SECRET_API || process.env.WEBHOOK_SECRET || '9ffdc0452246247666f9f7bf233d2059a2f1cfe40068d15bee7fe09b296bd2ad5de57442315d20bfc2fa46f6abeab11ec76126c143d5888c3707362e302db8b6';
  
  // Validar el token contra el secreto configurado en el entorno
  if (token !== apiSecret) {
    return res.status(403).json({
      error: 'Prohibido',
      message: 'El token provisto es inválido.'
    });
  }
  
  next();
}

// ============================================================
// SOPORTE DE FACTURACIÓN Y CONTROL DE ESTADO DE PAGO
// ============================================================
function checkStoreStatus(store) {
  const today = new Date();
  const dayOfMonth = today.getDate(); // 1 a 31
  
  // Si la tienda está explícitamente marcada como unpaid y ya pasamos el día 15
  if (dayOfMonth > 15 && store.paymentStatus === 'unpaid') {
    return {
      active: false,
      reason: 'Tu tienda ha sido deshabilitada temporalmente por falta de pago. Tienes del 1 al 15 de cada mes para abonar el servicio de Esencia.'
    };
  }
  
  return { active: true };
}

let transporter;
function getTransporter() {
  if (!transporter && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
}

async function sendPasswordEmail(email, storeName, newPassword) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) {
    console.log('[Warning SMTP] No configurado. Contraseña no enviada por mail:', newPassword);
    return false;
  }
  
  const mailOptions = {
    from: `"Soporte Esencia" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Nueva Contraseña para tu Tienda — ${storeName}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #2e3230; border-bottom: 2px solid #2e3230; padding-bottom: 10px;">Esencia Onboarding</h2>
        <p>Hola,</p>
        <p>Hemos procesado la solicitud de cambio de contraseña para tu cuenta de la tienda <strong>"${storeName}"</strong>.</p>
        <p>Tus nuevas credenciales de acceso son:</p>
        <table style="width: 100%; background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <tr>
            <td style="font-weight: bold; width: 100px;">Usuario:</td>
            <td>${email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Contraseña:</td>
            <td><code style="background: #eef; padding: 2px 6px; border-radius: 4px; font-size: 1.1em;">${newPassword}</code></td>
          </tr>
        </table>
        <p>Te recomendamos ingresar al panel de administración y cambiarla en la sección de configuraciones.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.85em; color: #777;">Este es un mensaje automático. No respondas a este correo.</p>
      </div>
    `
  };
  
  try {
    await mailTransporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error enviando mail con nodemailer:', error);
    return false;
  }
}

// ============================================================
// TIENDAS (persistencia de datos local)
// ============================================================
router.get('/stores/:slug', (req, res) => {
  const store = storesDB[req.params.slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  
  const status = checkStoreStatus(store);
  if (!status.active) {
    return res.status(402).json({ error: 'Pago requerido', message: status.reason });
  }

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
  
  const status = checkStoreStatus(store);
  if (!status.active) {
    return res.status(402).json({ error: 'Pago requerido', message: status.reason });
  }

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
// CONFIGURACIÓN DE CONTRASENAS Y FACTURACIÓN
// ============================================================
router.post('/stores/:slug/change-password', authMiddleware, async (req, res) => {
  const { slug } = req.params;
  const store = storesDB[slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  
  let { password } = req.body;
  if (!password) {
    // Generar una clave temporal segura si no se envía
    password = 'Esencia_' + crypto.randomBytes(3).toString('hex').toUpperCase();
  }
  
  store.password = password;
  saveDB();
  
  const emailSent = await sendPasswordEmail(store.email, store.name, password);
  
  res.json({
    message: 'Contraseña actualizada correctamente.',
    password,
    emailSent
  });
});

router.put('/stores/:slug/billing', authMiddleware, (req, res) => {
  const { slug } = req.params;
  const store = storesDB[slug];
  if (!store) return res.status(404).json({ error: 'Tienda no encontrada' });
  
  const { paymentStatus } = req.body;
  if (paymentStatus && ['paid', 'unpaid'].includes(paymentStatus)) {
    store.paymentStatus = paymentStatus;
    saveDB();
    return res.json({ message: 'Estado de facturación actualizado', store });
  }
  
  res.status(400).json({ error: 'paymentStatus inválido. Debe ser paid o unpaid.' });
});

// ============================================================
// PROVISIONING INTERNO (llamado desde server.js post-pago)
// ============================================================
router.provisionStore = function(slug, name, email, products) {
  storesDB[slug] = {
    slug,
    name,
    email,
    password: crypto.randomBytes(4).toString('hex').toUpperCase(),
    paymentStatus: 'paid',
    description: '',
    phone: '',
    address: '',
    storeUrl: `http://${slug}.katrix.com.ar`,
    products: products || []
  };
  saveDB();
  return storesDB[slug];
};

// ============================================================
// AUTENTICACIÓN / INICIO DE SESIÓN
// ============================================================
router.post('/auth/login', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email requerido' });
  }

  // Buscar si hay alguna tienda con este email registrado
  const store = Object.values(storesDB).find(s => s.email && s.email.toLowerCase() === email.toLowerCase());
  
  if (store) {
    return res.json({
      hasPaid: true,
      storeInfo: store,
      firstName: store.name || email.split('@')[0],
      lastName: ''
    });
  } else {
    // Si no existe, simulamos si es el admin por defecto
    if (email.toLowerCase() === 'admin@perfumeria.com') {
      return res.json({
        hasPaid: true,
        storeInfo: {
          name: 'Mi Perfumería Esencia',
          description: 'Fragancias exclusivas y decants seleccionados.',
          slug: 'mi-perfumeria',
          phone: '+54 11 9876-5432',
          email: 'admin@perfumeria.com',
          address: 'Av. Alvear 1850, CABA, Argentina',
          storeUrl: 'http://mi-perfumeria.katrix.com.ar',
          products: []
        },
        firstName: 'Admin',
        lastName: 'Esencia'
      });
    }
    
    // Si no existe ninguna tienda para ese email, no ha pagado
    return res.json({
      hasPaid: false
    });
  }
});

router.swaggerSpec = swaggerSpec;
router.PLANS = PLANS;

module.exports = router;



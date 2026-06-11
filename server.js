const express = require('express');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const { MercadoPagoConfig, Order } = require('mercadopago');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const apiRouter = require('./api');

// Cargar variables de entorno si existe el archivo .env (útil en dev)
require('dotenv').config();

const app = express();
app.enable('trust proxy');
const PORT = process.env.PORT || 3000;

// Configurar SDK de Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});
const orderAPI = new Order(client);

// ============================================================
// SEGURIDAD DEL SERVIDOR (Helmet & Rate Limiting)
// ============================================================
// Cabeceras de seguridad HTTP (deshabilitamos CSP para evitar conflictos con los estilos inline de Swagger UI)
app.use(helmet({
  contentSecurityPolicy: false
}));

// Limitador general de peticiones en la API para prevenir abuso y ataques DoS
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // Máximo 300 peticiones por IP en el periodo
  message: { error: 'Demasiadas peticiones desde esta IP. Por favor intenta de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api', generalLimiter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================================
// API ROUTER (planes, tiendas, productos, config, docs)
// ============================================================
app.use('/api', apiRouter);

// Redireccionar /docs a la documentación oficial en /api/docs
app.get('/docs', (req, res) => {
  res.redirect('/api/docs');
});

// Función helper para mapear los datos del frontend (Payment Brick) al formato de Orders API
function mapCardFormDataToOrder(cardFormData) {
  const amountStr = String(cardFormData.transaction_amount);
  const planName = cardFormData.plan_name || 'Plan Esencial';
  
  // En Orders API, unit_price debe ser un string
  const unitPriceStr = String(cardFormData.plan_price || cardFormData.transaction_amount || 11900);

  // Determinar si es tarjeta de crédito, débito o ticket
  let paymentMethodType = cardFormData.payment_method_type;
  if (!paymentMethodType) {
    paymentMethodType = 'credit_card';
    if (cardFormData.payment_method_id && (
      cardFormData.payment_method_id.includes('debit') ||
      cardFormData.payment_method_id.includes('deb') ||
      cardFormData.payment_method_id.includes('maestro') ||
      cardFormData.payment_method_id.includes('visa_electron') ||
      cardFormData.payment_method_id.includes('cabal')
    )) {
      paymentMethodType = 'debit_card';
    } else if (cardFormData.payment_method_id === 'rapipago' || cardFormData.payment_method_id === 'pagofacil') {
      paymentMethodType = 'ticket';
    }
  }

  const paymentObj = {
    amount: amountStr,
    payment_method: {
      id: cardFormData.payment_method_id,
      type: paymentMethodType
    }
  };

  if (cardFormData.token) {
    paymentObj.payment_method.token = cardFormData.token;
  }
  if (cardFormData.installments) {
    paymentObj.payment_method.installments = Number(cardFormData.installments);
  }

  const email = cardFormData.payer?.email || 'test@testuser.com';
  const firstName = cardFormData.payer?.first_name || 'Juan';
  const lastName = cardFormData.payer?.last_name || 'Perez';

  const payerObj = {
    email: email,
    first_name: firstName,
    last_name: lastName,
    identification: {
      type: cardFormData.payer?.identification?.type || 'DNI',
      number: cardFormData.payer?.identification?.number || '12345678'
    }
  };

  const body = {
    type: 'online',
    processing_mode: 'automatic',
    total_amount: amountStr,
    external_reference: `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    payer: payerObj,
    items: [
      {
        title: planName,
        description: `Suscripción al ${planName} de Esencia`,
        quantity: 1,
        unit_price: unitPriceStr,
        category_id: 'services'
      }
    ],
    transactions: {
      payments: [paymentObj]
    }
  };

  return body;
}

// Helper para bypassear el SDK y hacer la petición directa
async function createOrderDirect(orderBody) {
  const response = await fetch('https://api.mercadopago.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      'X-Idempotency-Key': crypto.randomUUID()
    },
    body: JSON.stringify(orderBody)
  });
  if (!response.ok) {
    const err = await response.json();
    throw err;
  }
  return response.json();
}

function generateOnboardingEmails(cardFormData, orderId, requestHost) {
  try {
    const firstName = cardFormData.payer?.first_name || 'Cliente';
    const lastName = cardFormData.payer?.last_name || '';
    const email = cardFormData.payer?.email || 'cliente@esencia.com';
    
    const storeName = cardFormData.store_name || `Perfumería de ${firstName}`;
    const storeSlug = cardFormData.store_slug || firstName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'mi-perfumeria';
    
    // Dynamically calculate the frontend origin and admin panel link
    let origin = 'http://localhost:4200';
    if (requestHost) {
      if (requestHost.includes('localhost') || requestHost.includes('127.0.0.1')) {
        origin = 'http://localhost:4200';
      } else {
        origin = `https://esencia.katrix.com.ar`; // Base domain for admin
      }
    }
    const storeUrl = `http://${storeSlug}.katrix.com.ar`;
    
    const tempPassword = `Esencia_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const paymentDate = new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const paymentAmount = `$${cardFormData.plan_price || cardFormData.transaction_amount || 0}`;

    const clientEmailBody = `Asunto: ¡Tu tienda en Esencia está lista, ${firstName}!

Hola ${firstName},

¡Felicidades! Nos alegra contarte que tu tienda en Esencia ha sido creada exitosamente y ya se encuentra activa para recibir visitas.

Aquí tienes el enlace para ver tu tienda pública:
${storeUrl}

Para comenzar a configurar y gestionar tu negocio, puedes ingresar a tu panel de administración en:
${origin}/admin

Tus credenciales de acceso son:
Usuario: ${email}
Contraseña temporal: ${tempPassword}

Te recomendamos realizar los siguientes primeros pasos para poner a punto tu tienda:
1. Iniciar sesión en el panel de administración con tu contraseña temporal.
2. Subir tu logo y personalizar los colores de la tienda.
3. Agregar tus primeros productos al catálogo.
4. Compartir el link de tu tienda con tus clientes.

Si tienes alguna duda o necesitas asistencia durante la configuración, no dudes en ponerte en contacto con el equipo de soporte de Katrix respondiendo a este correo o escribiendo a soporte@katrix.co.

¡Mucho éxito con tu nueva perfumería online!

El equipo de Esencia & Katrix`;

    const internalEmailBody = `Asunto: Nueva tienda creada — ${storeName}

Equipo de Katrix,

Se ha completado el registro y pago para una nueva tienda en la plataforma Esencia. A continuación se detallan los datos de aprovisionamiento:

Cliente: ${firstName} ${lastName}
Email de contacto: ${email}

Información de la tienda:
- Nombre de la tienda: ${storeName}
- URL pública: ${storeUrl}

Detalles del pago:
- Fecha de pago: ${paymentDate}
- Monto pagado: ${paymentAmount}

Recordatorio: Realizar seguimiento preventivo a las 48 horas si el cliente aún no ha iniciado sesión en su panel de administración.`;

    // Ensure emails directory exists
    const emailsDir = path.join(__dirname, 'emails');
    if (!fs.existsSync(emailsDir)) {
      fs.mkdirSync(emailsDir, { recursive: true });
    }

    // Write files as backup
    fs.writeFileSync(path.join(emailsDir, `email_cliente_${orderId}.txt`), clientEmailBody, 'utf8');
    fs.writeFileSync(path.join(emailsDir, `email_interno_${orderId}.txt`), internalEmailBody, 'utf8');

    console.log(`\n==================================================`);
    console.log(`ONBOARDING EMAILS GENERATED FOR ORDER ${orderId}`);
    console.log(`Saved to workspace: emails/email_cliente_${orderId}.txt & email_interno_${orderId}.txt`);
    console.log(`==================================================\n`);

    // Dynamic Nodemailer Integration
    try {
      const nodemailer = require('nodemailer');
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });

        // Email to customer
        transporter.sendMail({
          from: `"Esencia Onboarding" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `¡Tu tienda en Esencia está lista, ${firstName}!`,
          text: clientEmailBody.replace(/^Asunto:.*\n/, '')
        }).then(info => {
          console.log('Email enviado al cliente con éxito:', info.messageId);
        }).catch(err => {
          console.error('Error al enviar email al cliente:', err);
        });

        // Email to internal team
        const recipientKatrix = process.env.KATRIX_NOTIFICATION_EMAIL || 'igsrdev@katrix.com.ar';
        transporter.sendMail({
          from: `"Esencia Onboarding" <${process.env.SMTP_USER}>`,
          to: recipientKatrix,
          subject: `Nueva tienda creada — ${storeName}`,
          text: internalEmailBody.replace(/^Asunto:.*\n/, '')
        }).then(info => {
          console.log('Email interno enviado a Katrix con éxito:', info.messageId);
        }).catch(err => {
          console.error('Error al enviar email interno:', err);
        });
      } else {
        console.log('[Warning] SMTP_USER y SMTP_PASS no están configurados en el archivo .env. Los correos reales no se enviarán.');
      }
    } catch (e) {
      console.log('[Info] Nodemailer no está instalado en el proyecto. Para habilitar el envío real de emails ejecuta: npm install nodemailer');
    }

    return { tempPassword, storeUrl, storeSlug, storeName };
  } catch (error) {
    console.error('Error generating onboarding emails:', error);
    return {};
  }
}

// ==========================================
// 1. Endpoint Proxy para procesar el pago (Orders API)
// ==========================================
app.post('/api/pagos/v1/payments', async (req, res) => {
  try {
    const orderBody = mapCardFormDataToOrder(req.body);
    console.log('Creando Order (v1/orders) directa:', new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }), '\n', JSON.stringify(orderBody, null, 2));

    const response = await createOrderDirect(orderBody);
    
    // Generar emails de onboarding y aprovisionar tienda en tiempo real
    let onboarding = {};
    if (response.id) {
      onboarding = generateOnboardingEmails(req.body, response.id, req.headers.host) || {};
      
      if (req.body.store_slug) {
        apiRouter.provisionStore(
          req.body.store_slug,
          req.body.store_name || 'Mi Perfumería',
          req.body.payer?.email || 'cliente@esencia.com',
          []
        );
        console.log(`[Tiempo Real] Tienda provisionada: ${req.body.store_slug} para ${req.body.payer?.email}`);
      }
    }
    
    res.status(201).json({ ...response, ...onboarding });
  } catch (error) {
    console.error('Error al procesar la Order directa:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: 'Error procesando el pago', details: error });
  }
});

// Endpoint adicional para el Card Payment Brick de Mercado Pago
app.post(['/process_payment', '/api/payments/create'], async (req, res) => {
  try {
    const orderBody = mapCardFormDataToOrder(req.body);
    console.log('Creando Order (process_payment) directa:', new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }), '\n', JSON.stringify(orderBody, null, 2));

    const response = await createOrderDirect(orderBody);
    console.log('Respuesta de Order directa:', response);
    
    let paymentId = response.id;
    if (response.transactions && response.transactions.payments && response.transactions.payments.length > 0) {
      paymentId = response.transactions.payments[0].id || response.id;
    }
    
    // Generar emails de onboarding y aprovisionar tienda en tiempo real
    let onboarding = {};
    if (paymentId) {
      onboarding = generateOnboardingEmails(req.body, paymentId, req.headers.host) || {};
      
      if (req.body.store_slug) {
        apiRouter.provisionStore(
          req.body.store_slug,
          req.body.store_name || 'Mi Perfumería',
          req.body.payer?.email || 'cliente@esencia.com',
          []
        );
        console.log(`[Tiempo Real] Tienda provisionada: ${req.body.store_slug} para ${req.body.payer?.email}`);
      }
    }
    
    res.status(201).json({ ...response, id: paymentId, ...onboarding });
  } catch (error) {
    console.error('Error al crear la Order directa:', JSON.stringify(error, null, 2));
    res.status(500).json(error);
  }
});

// ==========================================
// 2. Webhook de Mercado Pago
// ==========================================
app.post('/webhook', async (req, res) => {
  try {
    const xSignature = req.headers['x-signature'] || '';
    const xRequestId = req.headers['x-request-id'] || '';
    const webhookSecret = process.env.WEBHOOK_SECRET || '';

    let rawDataId = req.query['data.id'] || req.body?.data?.id || req.body?.id;
    let dataId = rawDataId ? String(rawDataId) : '';
    let type = req.query['type'] || req.body?.type;

    console.log('Mercado Pago Webhook recibido en /webhook:', { type, dataId, xRequestId, body: req.body });

    // Validación de Firma HMAC
    if (webhookSecret && xSignature && dataId) {
      let ts = '';
      let hash = '';

      const parts = xSignature.split(',');
      parts.forEach(part => {
        const [k, v] = part.split('=').map(s => s.trim());
        if (k === 'ts') ts = v;
        if (k === 'v1') hash = v;
      });

      const manifest = `id:${dataId.toLowerCase()};request-id:${xRequestId};ts:${ts};`;
      const hmac = crypto.createHmac('sha256', webhookSecret);
      hmac.update(manifest);
      const sha = hmac.digest('hex');

      if (sha !== hash) {
        console.warn('Webhook MP: Validación de firma fallida', { manifest, generated: sha, received: hash });
      } else {
        console.log('Webhook MP: Validación de firma exitosa.');
      }
    }

    // Consultar el detalle del recurso si es una order
    if (dataId && (type === 'order' || req.body?.action?.includes('order')) && dataId !== '123456') {
      try {
        const orderDetails = await orderAPI.get({ id: dataId });
        console.log(`Detalles de la Order ${dataId} obtenidos con éxito:`, {
          status: orderDetails.status,
          status_detail: orderDetails.status_detail,
          total_amount: orderDetails.total_amount,
        });
      } catch (e) {
        console.error('Error al obtener detalles de la Order en Webhook:', e);
      }
    }

    // RESPONDER SIEMPRE 200 OK a Mercado Pago
    return res.status(200).json({ status: 'recibido' });

  } catch (error) {
    console.error('Error general en webhook:', error);
    return res.status(200).json({ status: 'error interno ignorado' });
  }
});

// /api/config ya está montado en apiRouter — no duplicar

// ==========================================
// 4. Servir Aplicación Angular (Frontend)
// ==========================================
const distPath = path.join(__dirname, 'dist/esencia-app/browser');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Node.js Express corriendo en el puerto ${PORT}`);
});

const express = require('express');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const { MercadoPagoConfig, Payment } = require('mercadopago');

// Cargar variables de entorno si existe el archivo .env (útil en dev)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// Configurar SDK de Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});
const payment = new Payment(client);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 1. Endpoint Proxy para procesar el pago
// ==========================================
app.post('/api/pagos/v1/payments', async (req, res) => {
  try {
    const paymentData = req.body;
    
    // El frontend ya manda la data en el formato esperado por el brick,
    // pero usando el SDK podemos asegurarnos de armar el body.
    const body = {
      transaction_amount: paymentData.transaction_amount,
      token: paymentData.token,
      description: paymentData.description,
      installments: paymentData.installments,
      payment_method_id: paymentData.payment_method_id,
      issuer_id: paymentData.issuer_id,
      payer: {
        email: paymentData.payer?.email,
        identification: paymentData.payer?.identification
      }
    };

    const response = await payment.create({ body });
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error al procesar el pago con MP:', error);
    res.status(500).json({ error: 'Error procesando el pago', details: error });
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
        // Seguimos adelante y devolvemos 200 de todas formas para que MP no marque error
      } else {
        console.log('Webhook MP: Validación de firma exitosa.');
      }
    }

    // Consultar el detalle del recurso si es un payment
    if (dataId && type === 'payment' && dataId !== '123456') {
      try {
        const paymentDetails = await payment.get({ id: dataId });
        console.log(`Detalles del pago ${dataId} obtenidos con éxito:`, {
          status: paymentDetails.status,
          status_detail: paymentDetails.status_detail,
          transaction_amount: paymentDetails.transaction_amount,
        });
        // AQUÍ PUEDES ACTUALIZAR TU BASE DE DATOS
      } catch (e) {
        console.error('Error al obtener detalles del pago en Webhook:', e);
      }
    }

    // IMPORTANTE: siempre responder 200 OK a Mercado Pago
    return res.status(200).json({ status: 'recibido' });

  } catch (error) {
    console.error('Error general en webhook:', error);
    // Para asegurar que MP no reintente infinitamente en caso de bug interno
    return res.status(200).json({ status: 'error interno ignorado' });
  }
});

// ==========================================
// 3. Endpoint Configuración (Llave Pública)
// ==========================================
app.get('/api/config', (req, res) => {
  res.json({
    publicKey: process.env.MERCADOPAGO_PUBLIC_KEY || ''
  });
});

// ==========================================
// 4. Servir Aplicación Angular (Frontend)
// ==========================================
const distPath = path.join(__dirname, 'dist/esencia-app/browser');
app.use(express.static(distPath));

// Rutas SPA (Redirigir todo al index.html si no es un archivo ni API)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Node.js Express corriendo en el puerto ${PORT}`);
});

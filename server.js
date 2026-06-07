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
app.post('/webhook/mercadopago', async (req, res) => {
  try {
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];
    const webhookSecret = process.env.WEBHOOK_SECRET || '';

    let dataId = req.query['data.id'] || req.body?.data?.id || req.body?.id;
    let type = req.query['type'] || req.body?.type;

    console.log('Mercado Pago Webhook recibido:', { type, dataId, xRequestId });

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
        console.warn('Webhook MP: Validación fallida', { manifest, generated: sha, received: hash });
        return res.status(400).json({ error: 'Firma inválida' });
      }
      console.log('Webhook MP: Validación exitosa.');
    }

    // Consultar el detalle del recurso si es un payment
    if (dataId && type === 'payment') {
      try {
        const paymentDetails = await payment.get({ id: dataId });
        console.log(`Detalles del pago ${dataId} obtenidos con éxito:`, {
          status: paymentDetails.status,
          status_detail: paymentDetails.status_detail,
          transaction_amount: paymentDetails.transaction_amount,
        });
        
        // AQUÍ PUEDES ACTUALIZAR TU BASE DE DATOS (marcar pedido como pagado)
        
      } catch (e) {
        console.error('Error al obtener detalles del pago en Webhook:', e);
      }
    }

    // Responder siempre 200 OK a Mercado Pago
    return res.status(200).json({ status: 'recibido' });

  } catch (error) {
    console.error('Error general en webhook:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
});

// ==========================================
// 3. Servir Aplicación Angular (Frontend)
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

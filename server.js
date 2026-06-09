const express = require('express');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const { MercadoPagoConfig, Order, Payment } = require('mercadopago');

// Cargar variables de entorno si existe el archivo .env (útil en dev)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// Configurar SDK de Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});
const payment = new Payment(client);
const order = new Order(client);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Función helper para mapear los datos del frontend (Payment Brick) al formato de Orders (Modo Automático)
function mapCardFormDataToOrder(cardFormData) {
  const amountStr = String(cardFormData.transaction_amount);
  
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

  const payer = {
    email: cardFormData.payer?.email || 'test@testuser.com'
  };

  if (cardFormData.payer?.first_name) {
    payer.first_name = cardFormData.payer.first_name;
  }
  if (cardFormData.payer?.last_name) {
    payer.last_name = cardFormData.payer.last_name;
  }
  if (cardFormData.payer?.identification) {
    payer.identification = cardFormData.payer.identification;
  }

  const paymentObj = {
    amount: amountStr,
    payment_method: {
      id: cardFormData.payment_method_id,
      type: paymentMethodType
    }
  };

  // Solo agregar token e installments si existen (para tarjetas)
  if (cardFormData.token) {
    paymentObj.payment_method.token = cardFormData.token;
  }
  if (cardFormData.installments) {
    paymentObj.payment_method.installments = Number(cardFormData.installments);
  }

  return {
    type: 'online',
    processing_mode: 'automatic',
    external_reference: `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    total_amount: amountStr,
    payer,
    transactions: {
      payments: [paymentObj]
    }
  };
}


// ==========================================
// 1. Endpoint Proxy para procesar el pago
// ==========================================
app.post('/api/pagos/v1/payments', async (req, res) => {
  try {
    const orderBody = mapCardFormDataToOrder(req.body);
    console.log('Creando Order (v1/payments) en Mercado Pago:', JSON.stringify(orderBody, null, 2));

    const response = await order.create({ body: orderBody });
    res.status(201).json(response);
  } catch (error) {
    console.error('Error al procesar la Order con MP:', error);
    res.status(500).json({ error: 'Error procesando el pago', details: error });
  }
});

// Endpoint adicional para el Card Payment Brick de Mercado Pago
app.post('/process_payment', (req, res) => {
  try {
    const orderBody = mapCardFormDataToOrder(req.body);
    console.log('Creando Order (process_payment) en Mercado Pago:', JSON.stringify(orderBody, null, 2));

    order.create({ body: orderBody })
      .then((response) => {
        console.log('Respuesta de Order de MP:', response);
        res.status(201).json(response);
      })
      .catch((error) => {
        console.error('Error al crear la Order en MP:', error);
        res.status(500).json(error);
      });
  } catch (error) {
    console.error('Error interno al procesar pago:', error);
    res.status(500).json({ error: 'Error procesando el pago', details: error.message });
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

    // Consultar el detalle del recurso si es un order o payment
    if (dataId && dataId !== '123456') {
      if (type === 'order') {
        try {
          const orderDetails = await order.get({ id: dataId });
          console.log(`Detalles de la Orden ${dataId} obtenidos con éxito:`, {
            status: orderDetails.status,
            status_detail: orderDetails.status_detail,
            total_amount: orderDetails.total_amount,
            external_reference: orderDetails.external_reference,
          });
          // AQUÍ PUEDES ACTUALIZAR TU BASE DE DATOS
        } catch (e) {
          console.error('Error al obtener detalles de la Orden en Webhook:', e);
        }
      } else if (type === 'payment') {
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

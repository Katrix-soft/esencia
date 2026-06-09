const express = require('express');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const { MercadoPagoConfig, Order } = require('mercadopago');

// Cargar variables de entorno si existe el archivo .env (útil en dev)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// Configurar SDK de Mercado Pago
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '' 
});
const orderAPI = new Order(client);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

  const body = {
    type: 'online',
    processing_mode: 'automatic',
    total_amount: amountStr,
    external_reference: `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    statement_descriptor: 'ESENCIA',
    payer: {
      email: email,
      first_name: firstName,
      last_name: lastName
    },
    additional_info: {
      payer: {
        registration_date: new Date().toISOString()
      },
      shipments: {
        receivers_address: {
          zip_code: '1425',
          state_name: 'CABA',
          city_name: 'Buenos Aires'
        }
      }
    },
    items: [
      {
        title: planName,
        description: `Suscripción al ${planName} de Esencia`,
        quantity: 1,
        unit_price: unitPriceStr
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

// ==========================================
// 1. Endpoint Proxy para procesar el pago (Orders API)
// ==========================================
app.post('/api/pagos/v1/payments', async (req, res) => {
  try {
    const orderBody = mapCardFormDataToOrder(req.body);
    console.log('Creando Order (v1/orders) directa:', JSON.stringify(orderBody, null, 2));

    const response = await createOrderDirect(orderBody);
    res.status(201).json(response);
  } catch (error) {
    console.error('Error al procesar la Order directa:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: 'Error procesando el pago', details: error });
  }
});

// Endpoint adicional para el Card Payment Brick de Mercado Pago
app.post('/process_payment', async (req, res) => {
  try {
    const orderBody = mapCardFormDataToOrder(req.body);
    console.log('Creando Order (process_payment) directa:', JSON.stringify(orderBody, null, 2));

    const response = await createOrderDirect(orderBody);
    console.log('Respuesta de Order directa:', response);
    // El frontend espera el payment.id en caso de éxito para el Swal
    let paymentId = response.id;
    if (response.transactions && response.transactions.payments && response.transactions.payments.length > 0) {
      paymentId = response.transactions.payments[0].id || response.id;
    }
    
    // Enviamos la respuesta, el frontend extrae .id o .status
    res.status(201).json({ ...response, id: paymentId });
  } catch (error) {
    console.error('Error al crear la Order directa:', error);
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

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Node.js Express corriendo en el puerto ${PORT}`);
});

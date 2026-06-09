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

// Función helper para mapear los datos del frontend (Payment Brick) al formato de Payments (Checkout API estándar)
function mapCardFormDataToPayment(cardFormData) {
  const amountStr = String(cardFormData.transaction_amount);
  const planName = cardFormData.plan_name || 'Plan Esencial';
  const planPrice = Number(cardFormData.plan_price || cardFormData.transaction_amount || 11900);

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

  // Payer detallado (obligatorio y recomendado para homologación de Payments)
  const payer = {
    email: cardFormData.payer?.email || 'test@testuser.com',
    first_name: cardFormData.payer?.first_name || 'Juan',
    last_name: cardFormData.payer?.last_name || 'Perez',
    phone: {
      area_code: cardFormData.payer?.phone?.area_code || '11',
      number: cardFormData.payer?.phone?.number || '1543210987'
    }
  };

  if (cardFormData.payer?.identification) {
    payer.identification = cardFormData.payer.identification;
  }

  // Items para la información adicional (sin external_code, unit_price es un número)
  const items = [
    {
      id: cardFormData.plan_name ? `plan_${cardFormData.plan_name.toLowerCase().replace(/\s+/g, '_')}` : 'plan_esencial',
      title: planName,
      description: `Suscripción al ${planName} de Esencia`,
      quantity: 1,
      unit_price: planPrice,
      category_id: 'services'
    }
  ];

  // Información adicional completa para homologación (sin receivers_address duplicado, solo receiver_address)
  const additional_info = {
    items,
    payer: {
      first_name: cardFormData.payer?.first_name || 'Juan',
      last_name: cardFormData.payer?.last_name || 'Perez',
      phone: {
        area_code: cardFormData.payer?.phone?.area_code || '11',
        number: cardFormData.payer?.phone?.number || '1543210987'
      },
      registration_date: new Date().toISOString(),
      authentication_type: 'email',
      last_purchase: new Date().toISOString(),
      is_first_purchase_online: true
    },
    shipments: {
      receiver_address: {
        zip_code: '1425',
        state_name: 'CABA',
        city_name: 'Buenos Aires',
        street_name: 'Av. Santa Fe',
        street_number: 3000
      }
    }
  };

  const body = {
    transaction_amount: Number(amountStr),
    description: `Suscripción al ${planName} de Esencia`,
    payment_method_id: cardFormData.payment_method_id,
    payer,
    statement_descriptor: 'ESENCIA',
    additional_info,
    external_reference: `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
  };

  if (cardFormData.token) {
    body.token = cardFormData.token;
  }
  if (cardFormData.installments) {
    body.installments = Number(cardFormData.installments);
  }

  return body;
}

// ==========================================
// 1. Endpoint Proxy para procesar el pago
// ==========================================
app.post('/api/pagos/v1/payments', async (req, res) => {
  try {
    const paymentBody = mapCardFormDataToPayment(req.body);
    console.log('Creando Pago (v1/payments) en Mercado Pago:', JSON.stringify(paymentBody, null, 2));

    const response = await payment.create({ body: paymentBody });
    res.status(201).json(response);
  } catch (error) {
    console.error('Error al procesar el Pago con MP:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: 'Error procesando el pago', details: error });
  }
});

// Endpoint adicional para el Card Payment Brick de Mercado Pago
app.post('/process_payment', (req, res) => {
  try {
    const paymentBody = mapCardFormDataToPayment(req.body);
    console.log('Creando Pago (process_payment) en Mercado Pago:', JSON.stringify(paymentBody, null, 2));

    payment.create({ body: paymentBody })
      .then((response) => {
        console.log('Respuesta de Pago de MP:', response);
        res.status(201).json(response);
      })
      .catch((error) => {
        console.error('Error al crear el Pago en MP:', JSON.stringify(error, null, 2));
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
      } catch (e) {
        console.error('Error al obtener detalles del pago en Webhook:', e);
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

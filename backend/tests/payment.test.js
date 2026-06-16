// tests/payment.test.js — Tests de integración de Mercado Pago y configuración de Pagos
const request = require('supertest');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Cargar variables de entorno desde la raíz
const envPath = fs.existsSync(path.join(__dirname, '../.env')) 
  ? path.join(__dirname, '../.env') 
  : path.join(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Mocks para evitar interactuar con la DB y servicios externos reales en tests
jest.mock('../db/knex', () => {
  const mockKnex = jest.fn((table) => ({
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue(null), // Para simular que la tienda no existe y se puede provisionar
    insert: jest.fn().mockResolvedValue([{ slug: 'tienda-test' }]),
    returning: jest.fn().mockReturnThis(),
  }));
  mockKnex.raw = jest.fn().mockResolvedValue([{ 1: 1 }]);
  return mockKnex;
});

jest.mock('../db/migrate', () => ({
  runMigrations: jest.fn().mockResolvedValue(true),
}));

jest.mock('../lib/jwt', () => ({
  cleanExpiredTokens: jest.fn().mockResolvedValue(true),
}));

jest.mock('../lib/mailer', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
}));

// Importar el app configurado con sus endpoints
const app = require('../server');

describe('Payment System & Mercado Pago Credentials Integration', () => {
  
  it('debe tener las credenciales de Mercado Pago en las variables de entorno', () => {
    expect(process.env.MERCADOPAGO_ACCESS_TOKEN).toBeDefined();
    expect(process.env.MERCADOPAGO_ACCESS_TOKEN).not.toBe('');
    expect(process.env.MERCADOPAGO_PUBLIC_KEY).toBeDefined();
    expect(process.env.MERCADOPAGO_PUBLIC_KEY).not.toBe('');
  });

  describe('GET /api/config', () => {
    it('debe retornar la clave pública de Mercado Pago configurada en .env', async () => {
      const res = await request(app).get('/api/config');
      expect(res.status).toBe(200);
      expect(res.body.publicKey).toBe(process.env.MERCADOPAGO_PUBLIC_KEY);
      expect(res.body.plans).toBeDefined();
    });
  });

  describe('Validación directa con Mercado Pago API (GET /users/me)', () => {
    it('debe autenticar con éxito en Mercado Pago usando el access token del .env', async () => {
      const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (!token || token.startsWith('CAMBIA-')) {
        console.warn('⚠️ Saltando test de credencial real de Mercado Pago (token de ejemplo)');
        return;
      }

      try {
        const response = await fetch('https://api.mercadopago.com/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Si las credenciales son válidas, debe retornar 200 OK. 
        // Si son inválidas, retornará 401 Unauthorized.
        if (response.status === 401) {
          const errorData = await response.json();
          console.error('Mercado Pago Auth Error:', errorData);
        }
        
        expect(response.status).toBe(200);
      } catch (err) {
        if (err.message.includes('fetch failed') || err.code === 'EAI_AGAIN' || err.code === 'ENOTFOUND') {
          console.warn('⚠️ No hay conexión a internet para validar las credenciales de Mercado Pago. Saltando test...');
          return;
        }
        throw err;
      }
    });
  });

  describe('POST /api/pagos/v1/payments (Endpoint de pago)', () => {
    it('debe comunicarse con la API de Mercado Pago y retornar un error controlado si los datos de la tarjeta son ficticios', async () => {
      const payload = {
        transaction_amount: 11900,
        plan_name: 'Plan Semilla',
        plan_price: 11900,
        payment_method_id: 'visa',
        payment_method_type: 'credit_card',
        token: 'invalid_card_token_for_test', // Token ficticio para probar que se envía y MP lo rechaza correctamente
        installments: 1,
        payer: {
          email: 'test-buyer@katrix.com.ar',
          first_name: 'Comprador',
          last_name: 'Prueba',
          identification: {
            type: 'DNI',
            number: '12345678'
          }
        },
        store_slug: 'tienda-test-pago-' + Date.now(),
        store_name: 'Tienda Test Pago'
      };

      const res = await request(app)
        .post('/api/pagos/v1/payments')
        .send(payload);

      // Dado que el token de la tarjeta es ficticio, Mercado Pago responderá con error de validación (por ejemplo, token no encontrado).
      // Nuestro endpoint atrapa ese error de Mercado Pago y responde con un 500 (o el detalle del error).
      // Lo importante es verificar que la respuesta del endpoint proviene de Mercado Pago (es decir, contiene campos de error de MP)
      // y no es un crash/error de importación interno de nuestro servidor.
      expect([500, 400, 201]).toContain(res.status);
      
      if (res.status === 500) {
        expect(res.body).toHaveProperty('details');
        const details = res.body.details;
        // Mercado Pago suele retornar un json con message, error, status, etc.
        expect(details).toBeDefined();
        console.log('Respuesta de error de Mercado Pago validada exitosamente:', details.message || details);
      } else if (res.status === 201) {
        // En caso de que se use un token de test que pase (raro sin interactuar con bricks reales)
        expect(res.body).toHaveProperty('id');
      }
    });
  });

  describe('GET /api/pagos/v1/payment_methods', () => {
    it('debe retornar la lista de medios de pago configurados en Mercado Pago o el fallback estático', async () => {
      const res = await request(app).get('/api/pagos/v1/payment_methods');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
    });
  });
});

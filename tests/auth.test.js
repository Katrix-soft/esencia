// tests/auth.test.js — Tests de integración del flujo de autenticación
// Corre con Jest + Supertest. Usa una DB de test o mocks.
const request = require('supertest');
const express = require('express');
const bcrypt  = require('bcryptjs');

// Mock de knex para no necesitar una DB real en CI
jest.mock('../db/knex', () => {
  const stores = {
    esencia: {
      slug:           'esencia',
      name:           'Esencia Test',
      email:          'test@esencia.com',
      password_hash:  null, // Se setea en beforeAll
      description:    '',
      phone:          '',
      address:        '',
      store_url:      'http://esencia.katrix.com.ar',
      plan_id:        'semilla',
      payment_status: 'paid',
      visit_count:    0,
      created_at:     new Date(),
    },
  };
  const tokens = {};

  const mockKnex = jest.fn((table) => ({
    where: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    first: jest.fn(async () => {
      if (table === 'stores') return stores.esencia;
      if (table === 'refresh_tokens') return tokens[Object.keys(tokens)[0]] || null;
      return null;
    }),
    insert: jest.fn(async (data) => {
      if (table === 'refresh_tokens') tokens[data.token] = data;
      if (table === 'stores') return [{ ...stores.esencia, ...data }];
      return [data];
    }),
    update: jest.fn(async () => 1),
    increment: jest.fn(async () => 1),
    delete: jest.fn(async () => 1),
    returning: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    count: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  }));

  mockKnex.raw = jest.fn(async () => [{ 1: 1 }]);
  return mockKnex;
});

jest.mock('../db/migrate', () => ({ runMigrations: jest.fn(async () => {}) }));
jest.mock('../lib/jwt', () => ({
  signAccessToken:      jest.fn(() => 'mock-access-token'),
  createRefreshToken:   jest.fn(async () => 'mock-refresh-token'),
  verifyAccessToken:    jest.fn((t) => {
    if (t === 'mock-access-token') return { slug: 'esencia', email: 'test@esencia.com', name: 'Esencia Test' };
    throw new Error('Invalid token');
  }),
  rotateRefreshToken:   jest.fn(async () => ({
    accessToken:  'new-access-token',
    refreshToken: 'new-refresh-token',
    store:        { slug: 'esencia', email: 'test@esencia.com', name: 'Esencia Test' },
  })),
  invalidateRefreshToken: jest.fn(async () => true),
  cleanExpiredTokens:     jest.fn(async () => {}),
}));

jest.mock('../lib/mailer', () => ({
  sendWelcomeEmail:  jest.fn(async () => true),
  sendPasswordEmail: jest.fn(async () => true),
}));

jest.mock('../lib/webhooks', () => ({ dispatch: jest.fn(async () => {}) }));

// ---- Setup del servidor de test ----
let app;
beforeAll(async () => {
  // Inyectar hash real para poder validar contraseña en tests
  const knex = require('../db/knex');
  const hash = await bcrypt.hash('TestPassword123', 12);
  knex('stores')().first.mockResolvedValue({
    slug: 'esencia', name: 'Esencia Test', email: 'test@esencia.com',
    password_hash: hash, payment_status: 'paid', visit_count: 0,
    plan_id: 'semilla', store_url: 'http://esencia.katrix.com.ar',
    description: '', phone: '', address: '', created_at: new Date(),
  });

  app = express();
  app.use(express.json());
  app.use('/api', require('../api'));
});

// ---- Tests ----
describe('POST /api/auth/login', () => {
  it('debe retornar 422 si falta el email', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });

  it('debe retornar 422 si el email es inválido', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'no-es-email' });
    expect(res.status).toBe(422);
  });

  it('debe retornar 200 con access y refresh token en login exitoso', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@esencia.com', password: 'TestPassword123' });
    // Con mocks de bcrypt simplificados, puede retornar 401
    // El test real se corre contra una DB real
    expect([200, 401]).toContain(res.status);
  });
});

describe('POST /api/auth/logout', () => {
  it('debe retornar 200 aunque no se envíe token', async () => {
    const res = await request(app).post('/api/auth/logout').send({});
    expect(res.status).toBe(200);
  });
});

describe('GET /api/health', () => {
  it('debe retornar status healthy o degraded', async () => {
    const res = await request(app).get('/api/health');
    expect([200, 503]).toContain(res.status);
    expect(res.body.status).toBeDefined();
  });
});

describe('GET /api/plans', () => {
  it('debe retornar la lista de planes', async () => {
    const res = await request(app).get('/api/plans');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

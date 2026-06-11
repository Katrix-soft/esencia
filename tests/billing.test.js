// tests/billing.test.js — Tests del control de acceso por facturación (día 15)
const { checkStoreStatus } = require('../routes/stores');

describe('checkStoreStatus — Lógica de bloqueo por falta de pago', () => {
  const originalGetDate = Date.prototype.getDate;

  afterEach(() => {
    Date.prototype.getDate = originalGetDate;
  });

  it('debe permitir acceso si paymentStatus es "paid" (cualquier día)', () => {
    Date.prototype.getDate = () => 20; // Día 20
    const result = checkStoreStatus({ payment_status: 'paid' });
    expect(result.active).toBe(true);
  });

  it('debe permitir acceso si paymentStatus es "unpaid" pero aún es día 14', () => {
    Date.prototype.getDate = () => 14; // Antes del límite
    const result = checkStoreStatus({ payment_status: 'unpaid' });
    expect(result.active).toBe(true);
  });

  it('debe permitir acceso si paymentStatus es "unpaid" pero es exactamente día 15', () => {
    Date.prototype.getDate = () => 15; // Límite inclusive
    const result = checkStoreStatus({ payment_status: 'unpaid' });
    expect(result.active).toBe(true);
  });

  it('debe BLOQUEAR acceso si paymentStatus es "unpaid" y es día 16', () => {
    Date.prototype.getDate = () => 16; // Un día después del límite
    const result = checkStoreStatus({ payment_status: 'unpaid' });
    expect(result.active).toBe(false);
    expect(result.reason).toContain('falta de pago');
  });

  it('debe BLOQUEAR acceso si paymentStatus es "unpaid" y es día 31', () => {
    Date.prototype.getDate = () => 31;
    const result = checkStoreStatus({ payment_status: 'unpaid' });
    expect(result.active).toBe(false);
  });

  it('debe permitir acceso si paymentStatus es "paid" aunque sea día 31', () => {
    Date.prototype.getDate = () => 31;
    const result = checkStoreStatus({ payment_status: 'paid' });
    expect(result.active).toBe(true);
  });
});

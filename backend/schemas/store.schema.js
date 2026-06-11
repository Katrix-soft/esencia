// schemas/store.schema.js — Schemas de validación Zod para todos los endpoints
// Zod valida los inputs ANTES de que lleguen a la lógica de negocio.
// Si algo falla, retorna un 422 con descripción clara del error.
const { z } = require('zod');

// Validaciones comunes reutilizables
const slugSchema = z.string()
  .min(2, 'El slug debe tener al menos 2 caracteres.')
  .max(60, 'El slug no puede superar 60 caracteres.')
  .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones.');

const passwordSchema = z.string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres.')
  .max(100, 'La contraseña no puede superar 100 caracteres.');

// =====================
// AUTH
// =====================
const loginSchema = z.object({
  email:    z.string().email('El email no tiene un formato válido.'),
  password: z.string().min(1, 'La contraseña es requerida.').optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10, 'Refresh token inválido.'),
});

// =====================
// TIENDAS
// =====================
const createStoreSchema = z.object({
  slug:        slugSchema,
  name:        z.string().min(2, 'El nombre de la tienda es requerido.').max(120),
  email:       z.string().email('Email inválido.'),
  description: z.string().max(500).optional().default(''),
  phone:       z.string().max(30).optional().default(''),
  address:     z.string().max(200).optional().default(''),
  plan_id:     z.enum(['semilla', 'flor', 'extracto']).optional().default('semilla'),
});

const updateStoreSchema = z.object({
  name:        z.string().min(2).max(120).optional(),
  description: z.string().max(500).optional(),
  phone:       z.string().max(30).optional(),
  address:     z.string().max(200).optional(),
  plan_id:     z.enum(['semilla', 'flor', 'extracto']).optional(),
});

const changePasswordSchema = z.object({
  password: passwordSchema.optional(), // Si no se envía, se genera automáticamente
});

const billingSchema = z.object({
  paymentStatus: z.enum(['paid', 'unpaid'], {
    errorMap: () => ({ message: 'paymentStatus debe ser "paid" o "unpaid".' }),
  }),
});

// =====================
// PRODUCTOS
// =====================
const createProductSchema = z.object({
  name:      z.string().min(1, 'El nombre del producto es requerido.').max(200),
  brand:     z.string().max(100).optional().default(''),
  category:  z.string().max(100).optional().default(''),
  price:     z.number({ invalid_type_error: 'El precio debe ser un número.' }).nonnegative('El precio no puede ser negativo.'),
  stock:     z.number({ invalid_type_error: 'El stock debe ser un número.' }).int().nonnegative().optional().default(0),
  volume:    z.string().max(50).optional().default(''),
  image_url: z.string().url('image_url debe ser una URL válida.').optional().default(''),
});

const updateProductSchema = createProductSchema.partial(); // Todos los campos opcionales para PUT

// =====================
// WEBHOOKS
// =====================
const createWebhookSchema = z.object({
  url: z.string().url('La URL del webhook debe ser válida.'),
  events: z.array(
    z.enum(['payment.paid', 'payment.overdue', 'store.suspended', 'store.reactivated', 'product.created'])
  ).min(1, 'Debés suscribirte a al menos un evento.').optional()
    .default(['payment.paid', 'payment.overdue']),
});

module.exports = {
  loginSchema,
  refreshSchema,
  createStoreSchema,
  updateStoreSchema,
  changePasswordSchema,
  billingSchema,
  createProductSchema,
  updateProductSchema,
  createWebhookSchema,
};

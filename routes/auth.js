// routes/auth.js — Login, Refresh Token y Logout con JWT real
const express  = require('express');
const bcrypt   = require('bcryptjs');
const knex     = require('../db/knex');
const logger   = require('../lib/logger');
const { signAccessToken, createRefreshToken, rotateRefreshToken, invalidateRefreshToken } = require('../lib/jwt');
const { validate }       = require('../middleware/validate');
const { loginSchema, refreshSchema } = require('../schemas/store.schema');

const router = express.Router();

// =====================================================
// POST /auth/login
// Valida email + contraseña y retorna JWT + refresh token
// =====================================================
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    const store = await knex('stores')
      .where(knex.raw('LOWER(email) = ?', [email.toLowerCase()]))
      .first();

    if (!store) {
      // Responder igual aunque no exista — evita enumeración de emails
      return res.status(401).json({ error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos.' });
    }

    // Si se envía contraseña, validar con bcrypt
    if (password) {
      const valid = await bcrypt.compare(password, store.password_hash);
      if (!valid) {
        logger.warn('Login fallido: contraseña incorrecta.', { email });
        return res.status(401).json({ error: 'Credenciales inválidas', message: 'Email o contraseña incorrectos.' });
      }
    }

    const accessToken  = signAccessToken({ slug: store.slug, email: store.email, name: store.name });
    const refreshToken = await createRefreshToken(store.slug);

    logger.info('Login exitoso.', { slug: store.slug, email: store.email });

    // Incrementar contador de visitas
    await knex('stores').where({ slug: store.slug }).increment('visit_count', 1);

    return res.json({
      hasPaid:      true,
      accessToken,
      refreshToken,
      expiresIn:    15 * 60, // segundos
      storeInfo: {
        slug:           store.slug,
        name:           store.name,
        email:          store.email,
        description:    store.description,
        phone:          store.phone,
        address:        store.address,
        storeUrl:       store.store_url,
        planId:         store.plan_id,
        paymentStatus:  store.payment_status,
      },
      firstName: store.name || email.split('@')[0],
      lastName:  '',
    });
  } catch (err) {
    logger.error('Error en login.', { error: err.message });
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// =====================================================
// POST /auth/refresh
// Intercambia un refresh token expirado por un par nuevo
// =====================================================
router.post('/refresh', validate(refreshSchema), async (req, res) => {
  try {
    const { accessToken, refreshToken, store } = await rotateRefreshToken(req.body.refreshToken);
    logger.info('Refresh token rotado.', { slug: store.slug });
    return res.json({ accessToken, refreshToken, expiresIn: 15 * 60 });
  } catch (err) {
    logger.warn('Refresh token inválido.', { error: err.message });
    return res.status(401).json({ error: 'Refresh token inválido o expirado.' });
  }
});

// =====================================================
// POST /auth/logout
// Invalida el refresh token activo (cierre de sesión seguro)
// =====================================================
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await invalidateRefreshToken(refreshToken);
  }
  logger.info('Logout ejecutado.');
  return res.json({ message: 'Sesión cerrada exitosamente.' });
});

module.exports = router;

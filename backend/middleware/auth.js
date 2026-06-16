// middleware/auth.js — Middleware de autenticación JWT
// Acepta dos formas de autenticación:
//   1. JWT real (emitido por /auth/login) — para el panel admin del dueño de la tienda
//   2. API_IA — clave secreta para operaciones administrativas del sistema
const { verifyAccessToken } = require('../lib/jwt');
const logger = require('../lib/logger');

const API_SECRET = process.env.API_IA || '';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error:   'No autorizado',
      message: 'Se requiere un Bearer token en el header Authorization.',
    });
  }

  const token = authHeader.split(' ')[1];

  // Opción 1: Token de sistema (API_IA) — operaciones admin
  if (token === API_SECRET) {
    req.authType = 'api_secret';
    req.isAdmin  = true;
    return next();
  }

  // Opción 2: JWT real emitido por el login
  try {
    const payload  = verifyAccessToken(token);
    req.authType   = 'jwt';
    req.storeSlug  = payload.slug;
    req.storeEmail = payload.email;
    req.isAdmin    = false;
    return next();
  } catch (err) {
    logger.warn('Token JWT inválido o expirado.', { error: err.message, ip: req.ip });
    return res.status(403).json({
      error:   'Token inválido',
      message: 'El token está expirado o es inválido. Hacé login nuevamente.',
    });
  }
}

// Middleware adicional: verifica que el JWT pertenezca a la tienda del recurso
// (evita que la tienda A edite productos de la tienda B)
function requireStoreOwnership(req, res, next) {
  if (req.isAdmin) return next();  // Solo el sistema (API_IA) puede cambiar el estado de pago
  const { slug } = req.params;
  if (req.storeSlug && req.storeSlug !== slug) {
    return res.status(403).json({
      error:   'Acceso denegado',
      message: 'No tenés permiso para administrar esta tienda.',
    });
  }
  next();
}

module.exports = { authMiddleware, requireStoreOwnership };

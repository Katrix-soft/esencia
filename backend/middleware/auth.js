// middleware/auth.js — Middleware de autenticación JWT
// Acepta dos formas de autenticación:
//   1. JWT real (emitido por /auth/login) — para el panel admin del dueño de la tienda
//   2. WEBHOOK_SECRET_API — para operaciones administrativas del sistema (backward compat)
const { verifyAccessToken } = require('../lib/jwt');
const logger = require('../lib/logger');

const API_SECRET = process.env.WEBHOOK_SECRET_API
  || process.env.WEBHOOK_SECRET
  || '9ffdc0452246247666f9f7bf233d2059a2f1cfe40068d15bee7fe09b296bd2ad5de57442315d20bfc2fa46f6abeab11ec76126c143d5888c3707362e302db8b6';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error:   'No autorizado',
      message: 'Se requiere un Bearer token en el header Authorization.',
    });
  }

  const token = authHeader.split(' ')[1];

  // Opción 1: Token de sistema (WEBHOOK_SECRET_API) — operaciones admin
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
  if (req.isAdmin) return next(); // El sistema admin puede todo

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

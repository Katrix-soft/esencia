// middleware/storeLimiter.js — Rate limiting específico por store slug
// Cada tienda tiene su propio límite de 60 peticiones por minuto.
// Esto evita que una tienda con mucho tráfico afecte a las demás.
const rateLimit = require('express-rate-limit');

// Key generator que usa el slug del store como identificador
const storeKeyGenerator = (req) => {
  const slug = req.params?.slug || 'unknown';
  return `store:${slug}:${req.ip}`;
};

const storeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60,             // 60 peticiones por minuto por tienda
  keyGenerator: storeKeyGenerator,
  message: {
    error: 'Demasiadas peticiones',
    message: 'Superaste el límite de peticiones para esta tienda. Intentá en 1 minuto.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
  skip: (req) => req.method === 'OPTIONS', // No limitar preflight CORS
});

// Límite más estricto para endpoints de escritura (POST/PUT/DELETE)
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: storeKeyGenerator,
  message: {
    error: 'Demasiadas escrituras',
    message: 'Superaste el límite de operaciones de escritura. Intentá en 1 minuto.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { storeLimiter, writeLimiter };

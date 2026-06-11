// middleware/storeLimiter.js — Rate limiting específico por store slug
// express-rate-limit v7+ requiere usar ipKeyGenerator para manejar IPv6 correctamente.
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// Key generator que combina el slug de la tienda con la IP normalizada (IPv4/IPv6)
const storeKeyGenerator = (req) => {
  const slug = req.params?.slug || 'unknown';
  return `store:${slug}:${ipKeyGenerator(req)}`;
};

// Límite de lectura: 60 peticiones por minuto por tienda
const storeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: storeKeyGenerator,
  message: {
    error:   'Demasiadas peticiones',
    message: 'Superaste el límite de peticiones para esta tienda. Intentá en 1 minuto.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
  skip: (req) => req.method === 'OPTIONS',
});

// Límite de escritura: 20 peticiones por minuto por tienda (POST/PUT/DELETE)
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: storeKeyGenerator,
  message: {
    error:   'Demasiadas escrituras',
    message: 'Superaste el límite de operaciones de escritura. Intentá en 1 minuto.',
  },
  standardHeaders: true,
  legacyHeaders:   false,
});

module.exports = { storeLimiter, writeLimiter };

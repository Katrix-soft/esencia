// middleware/validate.js — Wrapper genérico para validación con schemas Zod
// Uso: router.post('/ruta', validate(miSchema), handler)
// Si el body no cumple el schema, retorna 422 con descripción clara de cada error.
const logger = require('../lib/logger');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field:   e.path.join('.'),
        message: e.message,
      }));

      logger.warn('Validación de input fallida.', { path: req.path, errors });

      return res.status(422).json({
        error:   'Datos inválidos',
        message: 'El body de la petición contiene errores de validación.',
        errors,
      });
    }

    // Sobreescribir req.body con los datos parseados y sanitizados por Zod
    req.body = result.data;
    next();
  };
}

module.exports = { validate };

const knex = require('../db/knex');

async function cleanExpiredTokens() {
  try {
    await knex('refresh_tokens').where('expires_at', '<', new Date()).delete();
  } catch (err) {
    // Si la tabla no existe todavía, ignorar
  }
}

module.exports = { cleanExpiredTokens };

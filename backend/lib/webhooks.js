// lib/webhooks.js — Dispatcher de webhooks salientes hacia URLs registradas por cada tienda
// Cuando ocurre un evento (ej: pago aprobado, tienda suspendida), 
// este módulo notifica a todos los endpoints registrados en store_webhooks.
const axios  = require('axios');
const knex   = require('../db/knex');
const logger = require('./logger');

/**
 * Despacha un evento a todas las URLs webhook activas de una tienda.
 * @param {string} storeSlug - Slug de la tienda origen del evento
 * @param {string} event     - Nombre del evento (ej: 'payment.paid', 'store.suspended')
 * @param {object} payload   - Datos del evento a enviar en el body
 */
async function dispatch(storeSlug, event, payload = {}) {
  let webhooks = [];
  try {
    webhooks = await knex('store_webhooks')
      .where({ store_slug: storeSlug, active: true })
      .whereRaw('? = ANY(events)', [event]);
  } catch (err) {
    logger.error('Error al consultar webhooks salientes.', { storeSlug, event, error: err.message });
    return;
  }

  if (!webhooks.length) {
    logger.debug(`No hay webhooks registrados para el evento "${event}" en tienda "${storeSlug}".`);
    return;
  }

  const body = {
    event,
    store_slug: storeSlug,
    timestamp:  new Date().toISOString(),
    data:       payload,
  };

  for (const wh of webhooks) {
    try {
      await axios.post(wh.url, body, {
        timeout: 5000,
        headers: {
          'Content-Type':    'application/json',
          'X-Esencia-Event': event,
        },
      });
      logger.info(`Webhook saliente enviado exitosamente.`, { url: wh.url, event });
    } catch (err) {
      logger.warn(`Webhook saliente fallido.`, { url: wh.url, event, error: err.message });
      // No relanzamos el error — un fallo de webhook no debe interrumpir el flujo principal
    }
  }
}

module.exports = { dispatch };

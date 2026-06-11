// db/knex.js — Conexión singleton a PostgreSQL
// Usa DATABASE_URL del entorno (Easypanel lo inyecta automáticamente)
require('dotenv').config();

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL || {
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT) || 5432,
    user:     process.env.DB_USER     || 'esencia',
    password: process.env.DB_PASSWORD || 'esencia',
    database: process.env.DB_NAME     || 'esencia_db',
  },
  pool: { min: 2, max: 10 },
  acquireConnectionTimeout: 10000,
});

module.exports = knex;

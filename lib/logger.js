// lib/logger.js — Logging estructurado con Winston
// En desarrollo: coloreado en consola
// En producción (NODE_ENV=production): JSON puro para ingestión en sistemas externos
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, printf, json, errors } = format;

const isDev = process.env.NODE_ENV !== 'production';

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    let line = `${timestamp} [${level}] ${message}`;
    if (stack) line += `\n${stack}`;
    const extras = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
    return line + extras;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  format: isDev ? devFormat : prodFormat,
  transports: [
    new transports.Console(),
  ],
  exitOnError: false,
});

module.exports = logger;

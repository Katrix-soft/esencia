# backend/Dockerfile — Servidor Express + PostgreSQL (sin Angular)
# Usar cuando el frontend está separado (CDN, otro contenedor, etc.)
# Para el monorepo completo usar el Dockerfile en la raíz.

FROM node:20-alpine
WORKDIR /app

# Instalar dependencias de producción
COPY package*.json ./
RUN npm install --omit=dev

# Copiar todo el código del backend
COPY . .

# Crear directorio para emails de fallback (cuando no hay SMTP)
RUN mkdir -p /app/emails

# Puerto del servidor Express
EXPOSE 3000

# Las migraciones se ejecutan automáticamente al arrancar (desde api.js → initializeDB)
CMD ["node", "server.js"]

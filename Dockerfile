# Esencia SaaS — Dockerfile Multi-stage
# Stage 1: Build de Angular
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Servidor de Producción
FROM node:20-alpine
WORKDIR /app

# Dependencias de producción únicamente
COPY package*.json ./
RUN npm install --omit=dev

# Archivos compilados de Angular
COPY --from=builder /app/dist/ ./dist/

# Backend y módulos
COPY server.js api.js swagger-spec.js ./
COPY db/     ./db/
COPY lib/    ./lib/
COPY middleware/ ./middleware/
COPY routes/ ./routes/
COPY schemas/ ./schemas/

# Crear directorio para emails de fallback
RUN mkdir -p /app/emails

EXPOSE 3000

# Al arrancar: las migraciones se ejecutan automáticamente desde api.js (initializeDB)
CMD ["node", "server.js"]
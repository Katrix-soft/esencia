# Dockerfile raíz — Build completo: Angular frontend + Express backend
# Easypanel o Docker build desde la raíz del monorepo.

# ─────────────────────────────────────
# Stage 1: Build de Angular (frontend)
# ─────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY angular.json tsconfig.json tsconfig.app.json ./
COPY src/ ./src/

RUN npm run build

# ─────────────────────────────────────
# Stage 2: Backend Node.js (producción)
# ─────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Instalar solo dependencias de producción del backend
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copiar el código completo del backend
COPY backend/ ./

# Copiar el frontend compilado al lugar donde server.js lo sirve (../dist)
COPY --from=frontend-builder /app/dist/ ../dist/

# Directorio para emails fallback
RUN mkdir -p /app/emails

EXPOSE 3000

CMD ["node", "server.js"]
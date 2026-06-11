# Esencia SaaS — Dockerfile Multi-stage
# Stage 1: Build de Angular (frontend)
FROM node:20-alpine AS builder
WORKDIR /app

# Instalar dependencias Angular
COPY package*.json ./
RUN npm install
COPY angular.json tsconfig.json tsconfig.app.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Backend + Frontend compilado
FROM node:20-alpine
WORKDIR /app

# Instalar dependencias del backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copiar código del backend
COPY backend/ ./backend/

# Copiar build de Angular al lugar donde server.js lo espera
COPY --from=builder /app/dist/ ./dist/

# Copiar configuraciones de entorno (se sobreescriben en Easypanel)
COPY .env* ./

# Crear directorio para emails de fallback
RUN mkdir -p /app/backend/emails

EXPOSE 3000

# Entrypoint: correr migraciones automáticas + servidor
CMD ["node", "backend/server.js"]
# Dockerfile raíz — Servicio FRONTEND (esencia)
# Compila Angular y lo sirve con nginx.
# Para el backend, usar backend/Dockerfile (servicio backend-esencia).

# ─────────────────────────────────────
# Stage 1: Build de Angular
# ─────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY angular.json tsconfig.json tsconfig.app.json ./
COPY src/ ./src/

RUN npm run build

# ─────────────────────────────────────
# Stage 2: Servidor nginx (solo archivos estáticos)
# ─────────────────────────────────────
FROM nginx:alpine

# Copiar el build de Angular al directorio que sirve nginx
COPY --from=builder /app/dist/esencia-app/browser /usr/share/nginx/html

# Copiar la configuración de nginx (SPA routing + headers de seguridad)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
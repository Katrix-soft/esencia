# Etapa 1: Construcción (Build)
FROM node:20-alpine as build
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación Angular
RUN npm run build -- --configuration production

# Etapa 2: Servidor (Nginx)
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=build /app/dist/esencia-app/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
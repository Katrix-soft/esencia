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
# Copiar la configuración personalizada de Nginx si es necesaria (opcional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa anterior
# IMPORTANTE: Revisa angular.json para asegurarte de que "esencia-app" es el nombre correcto en outputPath
COPY --from=build /app/dist/esencia-app /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

# Build Angular
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve con Node.js (Express Backend + Angular SPA)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist/ ./dist/
COPY server.js api.js swagger-spec.js ./
EXPOSE 3000
CMD ["node", "server.js"]
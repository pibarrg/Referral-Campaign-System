# Imagen base pequeña
FROM node:20-alpine

# Vars de entorno
ENV NODE_ENV=production

# Herramientas mínimas (para healthcheck si hiciera falta)
RUN apk add --no-cache curl

# Usuario no-root
USER node
WORKDIR /app

# Dependencias
COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Código
COPY --chown=node:node server.js ./

# Exponer puerto
EXPOSE 5000

# Arranque
CMD ["node", "server.js"]

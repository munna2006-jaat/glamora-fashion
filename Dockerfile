# Production Dockerfile for GLAMORA
FROM node:20-alpine
WORKDIR /app

# Copy package manifests and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy standalone Express server, database and prebuilt frontend
COPY server.js ./
COPY glamora_store.json ./
COPY dist ./dist

# Standard Cloud Container environment configuration
ENV PORT=5005
ENV NODE_ENV=production

EXPOSE 5005

# Start server
CMD ["node", "server.js"]

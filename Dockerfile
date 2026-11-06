FROM node:20-alpine
WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm install --no-audit --no-fund

# Copy application source code
COPY . .

# Build production assets
RUN npm run build

# Cloud container environment
ENV PORT=5005
ENV NODE_ENV=production

EXPOSE 5005

# Start server
CMD ["node", "server.js"]

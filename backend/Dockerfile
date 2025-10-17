FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev for TypeScript)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies for smaller image
RUN npm prune --production

EXPOSE 3001

CMD ["node", "dist/index.js"]

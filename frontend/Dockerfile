FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production image - serve with Vite preview
FROM node:18-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm ci --production && npm install -g vite

EXPOSE 3000

CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "3000"]

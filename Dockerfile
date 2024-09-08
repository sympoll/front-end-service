# Use a multi-stage build for a production-optimized frontend
FROM node:20-slim as builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the application code
COPY . .

# Build the app with environment variables
ARG VITE_BASE_URL
ARG VITE_API_GATEWAY_URL
ARG VITE_KEYCLOAK_URL
RUN npm run build

# Use a smaller image for serving the built application
FROM node:20-slim

WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist /app/dist

# Install a lightweight web server like serve or http-server
RUN npm install -g serve

EXPOSE 8080

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "8080"]
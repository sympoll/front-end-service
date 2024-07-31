FROM node:20-slim AS build-stage
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-slim AS production-stage
WORKDIR /app
COPY --from=build-stage /app/build /app

EXPOSE 8080
CMD ["node", "app.js"]

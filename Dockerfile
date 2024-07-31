# Use official Node.js image as the base image
FROM node:20-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application using TypeScript and Vite
RUN npm run build

# Use a smaller base image for the final stage
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files for the final image
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist /app/dist

# Install only production dependencies
RUN npm install --production

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["npm", "run", "preview"]

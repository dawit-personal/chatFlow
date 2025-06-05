# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
# Use npm ci for faster, more reliable installs in CI/CD environments
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build


# Stage 2: Serve the application using Nginx
FROM nginx:stable-alpine

# Copy the build output from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration
# This config is crucial for single-page applications (SPAs)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# The Nginx image will automatically start the server on container start
# No CMD is needed unless you want to override the default behavior 
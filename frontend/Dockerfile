# Use Node 20 for compatibility with latest packages
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the frontend code
COPY . .

# Expose Vite's dev server port
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev"]

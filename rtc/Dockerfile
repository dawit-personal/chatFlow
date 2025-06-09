FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# Install nodemon globally for dev auto-reload
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["nodemon", "index.js"]

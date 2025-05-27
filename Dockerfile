# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure .env is copied
COPY .env .env

CMD ["npm", "run", "dev"] # hoặc ["node", "dist/index.js"]
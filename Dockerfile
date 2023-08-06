# Base image with Node.js
FROM node:14 as base

# Set working directory
WORKDIR /.

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application code
COPY . .

# Expose the port used by the Express.js application
EXPOSE 3000

# Run the Node.js application
CMD ["node", "index.js"]

# Development image
FROM base as dev
ENV NODE_ENV=development
RUN npm install
CMD ["npm", "run", "dev"]

# Redis image
FROM redis:latest as redis

# RabbitMQ image
FROM rabbitmq:latest as rabbitmq

# PostgreSQL image
FROM postgres:latest as postgres

# Define environment variables for PostgreSQL
ENV POSTGRES_USER=your_postgres_user
ENV POSTGRES_PASSWORD=your_postgres_password
ENV POSTGRES_DB=your_postgres_db


# Build and run the containers
FROM dev as final
--link redis:redis
--link rabbitmq:rabbitmq
--link postgres:postgres

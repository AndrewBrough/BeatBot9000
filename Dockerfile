# Stage 1: Build the TypeScript application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Install dependencies and build
RUN npm i && \
    npm run build

# Stage 2: Production environment
FROM openjdk:11-jre-slim

# Install Node.js 18
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Download and setup Lavalink
RUN curl -L https://github.com/freyacodes/Lavalink/releases/download/3.4/Lavalink.jar -o Lavalink.jar

# Create data directory for persistent storage
RUN mkdir -p /app/data

# Create start script
RUN echo "#!/bin/sh\n\
java -jar Lavalink.jar &\n\
sleep 10\n\
node dist/index.js" > start.sh && chmod +x start.sh

# Create volume for persistent data
VOLUME /app/data

# Expose ports
EXPOSE 2333 3000

# Environment variables for Lavalink
ENV LAVALINK_HOST=localhost \
    LAVALINK_PORT=2333

CMD ["./start.sh"]


# Stage 1: Build the TypeScript application
FROM node:16-alpine AS builder
WORKDIR /app

# Clone the repository (replace with the correct URL when available)
RUN apk add --no-cache git && \
    git clone https://github.com/AndrewBrough/BeatBot9000 .

# Install dependencies and build
RUN npm ci && \
    npm run build

# Stage 2: Production environment
FROM openjdk:11-jre-slim

# Install Node.js
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
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

# Working directory for the application
WORKDIR /app

CMD ["./start.sh"]


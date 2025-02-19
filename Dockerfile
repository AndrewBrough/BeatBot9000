# Stage 1: Build the TypeScript application
FROM node:18-alpine AS builder
WORKDIR /app

# Copy all necessary files for building
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# Install dependencies and build
RUN npm i && \
    NODE_ENV=production npm run build && \
    ls -la dist/commands  # Debug: List compiled commands

# Stage 2: Production environment
FROM node:18-alpine

WORKDIR /app

# Copy built application and dependencies from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Debug: List contents of commands directory
RUN ls -la dist/commands

# Set production environment
ENV NODE_ENV=production

# Start the bot using npm start
CMD ["npm", "start"]


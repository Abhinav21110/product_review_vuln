# Multi-stage Dockerfile: build frontend then run backend serving static assets

# ---- Build frontend ----
FROM node:20-alpine AS builder
WORKDIR /app
# Copy package files and lockfile if present
COPY package.json package-lock.json* ./
# Copy all source files needed for build
COPY . ./
# Install dependencies and build frontend
RUN npm ci --silent || npm install --silent
RUN npm run build --silent

# ---- Runtime image ----
FROM node:20-alpine AS runtime
WORKDIR /app
# Copy only backend package.json and install production deps
COPY backend/package.json ./backend/package.json
WORKDIR /app/backend
RUN npm install --production --silent

# Copy backend source
COPY backend ./backend
# Copy built frontend into backend/public so the express server can serve it
COPY --from=builder /app/dist ./backend/public

WORKDIR /app/backend
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]

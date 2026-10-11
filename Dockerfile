# ========================================================
# VYUGAM AI HACKATHON PLATFORM - PRODUCTION DOCKERFILE
# Multi-stage production build (Frontend + Backend)
# ========================================================

# Stage 1: Build the Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source code
COPY backend/ ./backend/

# Copy built frontend assets to the location expected by backend/src/server.js
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy root scripts and SQL schemas
COPY package*.json ./
COPY backend/supabase_schema.sql ./backend/

EXPOSE 5000

CMD ["node", "backend/src/server.js"]

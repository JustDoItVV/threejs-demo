# ==============================================================================
# Three.js Demo Application
# Security: non-root user, multi-stage build
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}

COPY package*.json ./
RUN npm ci --production=false

COPY . .
RUN NODE_ENV=production npm run build

# ==============================================================================
# Production image
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Установка wget для healthcheck
RUN apk add --no-cache wget

# Создаём non-root пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Копируем собранное приложение с правильным владельцем
COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/start.sh ./

RUN chmod +x start.sh

# Переключаемся на non-root пользователя
USER nodejs

ENV PORT=5000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD sh -c 'wget --quiet --tries=1 -O /dev/null http://localhost:5000${BASE_PATH}/api/health || exit 1'

CMD ["sh", "start.sh"]

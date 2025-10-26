FROM node:20-alpine AS builder

WORKDIR /usr/apps/threejs-demo

COPY package*.json ./

RUN npm ci --production=false

COPY . .

RUN NODE_ENV=production npm run build

FROM node:20-alpine AS runner

WORKDIR /usr/apps/threejs-demo

RUN apk add --no-cache wget

COPY --from=builder /usr/apps/threejs-demo/.next/standalone ./
COPY --from=builder /usr/apps/threejs-demo/.next/static ./.next/static
COPY --from=builder /usr/apps/threejs-demo/public ./public

COPY start.sh ./
RUN chmod +x start.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 -O /dev/null http://localhost:5000/threejs-demo/api/health || exit 1

CMD ["sh", "start.sh"]

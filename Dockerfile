FROM node:20-alpine AS builder

WORKDIR /usr/apps/threejs-demo

ARG BASE_PATH=""
ENV BASE_PATH=${BASE_PATH}

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

ENV PORT=5000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD sh -c 'wget --quiet --tries=1 -O /dev/null http://localhost:5000${BASE_PATH}/api/health || exit 1'

CMD ["sh", "start.sh"]

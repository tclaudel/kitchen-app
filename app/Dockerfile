FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV OPENCODE_SERVER_HOSTNAME=127.0.0.1
ENV OPENCODE_SERVER_PORT=4096

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl curl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN curl -fsSL https://opencode.ai/install | bash

# The runtime only needs Node to serve the standalone app, not npm's bundled tooling.
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

RUN mkdir -p /data /app/uploads
VOLUME ["/data", "/app/uploads"]

EXPOSE 3000
COPY docker/start.sh ./start.sh
RUN chmod +x ./start.sh
CMD ["./start.sh"]

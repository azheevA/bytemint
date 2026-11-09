FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_ADSENSE_CLIENT=
ARG NEXT_PUBLIC_ADSENSE_SLOT_TOP=
ARG NEXT_PUBLIC_AFFILIATE_HOSTING_URL=
ARG NEXT_PUBLIC_AFFILIATE_AI_URL=
ARG NEXT_PUBLIC_PREMIUM_PRODUCT_URL=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_ADSENSE_CLIENT=$NEXT_PUBLIC_ADSENSE_CLIENT
ENV NEXT_PUBLIC_ADSENSE_SLOT_TOP=$NEXT_PUBLIC_ADSENSE_SLOT_TOP
ENV NEXT_PUBLIC_AFFILIATE_HOSTING_URL=$NEXT_PUBLIC_AFFILIATE_HOSTING_URL
ENV NEXT_PUBLIC_AFFILIATE_AI_URL=$NEXT_PUBLIC_AFFILIATE_AI_URL
ENV NEXT_PUBLIC_PREMIUM_PRODUCT_URL=$NEXT_PUBLIC_PREMIUM_PRODUCT_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]

# Simple Node image for the Next.js app (engineering MVP).
FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Public env vars are inlined at build time for client-side fetch URLs.
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

ENV PORT=3000
EXPOSE 3000

# Bind to all interfaces so the port publish works from the host.
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]

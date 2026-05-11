# Simple Node image for the NestJS API (engineering MVP).
FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY nest-cli.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npx prisma generate
RUN npm run build

ENV PORT=4000
EXPOSE 4000

# Apply migrations when the container starts, then run the compiled app.
CMD ["sh", "-c", "npx prisma migrate deploy && exec node dist/src/main.js"]

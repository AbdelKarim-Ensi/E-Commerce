FROM node:22-alpine AS builder

WORKDIR /app

RUN apk update && apk upgrade --no-cache

RUN npm install -g npm@latest
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build



FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apk update && apk upgrade --no-cache

RUN npm install -g npm@latest
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev

RUN npx prisma generate

COPY --from=builder /app/dist ./dist


RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .


RUN npm run build



FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production


COPY --from=builder /app/dist ./dist


RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

EXPOSE 4000

CMD ["node", "dist/frontend/server/server.mjs"]
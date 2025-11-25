FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:20-alpine AS dev-dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=dev-dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS development

WORKDIR /app

COPY --from=dev-dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY . .

ENV NODE_ENV=development
EXPOSE 3000

CMD ["npm", "run", "start:dev"]

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000

USER node

CMD ["node", "dist/main.js"]
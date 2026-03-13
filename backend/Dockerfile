FROM node:20-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --shamefully-hoist
COPY . .
RUN pnpm exec prisma generate
RUN pnpm run build
CMD ["node", "dist/src/server.js"]
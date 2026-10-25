FROM node:20-alpine
WORKDIR /app
COPY package*.json tsconfig.json ./
COPY bin ./bin
COPY src ./src
RUN npm ci && npm run build && npm prune --omit=dev
ENTRYPOINT ["node","dist/bin/cli.js","mcp"]

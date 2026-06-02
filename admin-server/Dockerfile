FROM node:20-bookworm AS web-build
WORKDIR /app/web
COPY web/package.json ./
COPY web/package-lock.json ./
RUN npm ci
COPY web ./
RUN npm run build

FROM node:20-bookworm
WORKDIR /app
ENV NODE_ENV=production
COPY admin-server/package.json ./
COPY admin-server/package-lock.json ./
RUN npm ci --omit=dev
COPY admin-server/src ./src
COPY --from=web-build /app/web/dist /app/web-dist
WORKDIR /repo
EXPOSE 8088
CMD ["node", "/app/src/server.js"]

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with distroless Nginx (no shell, no package manager, non-root)
FROM cgr.dev/chainguard/nginx:latest AS production

COPY --from=builder /app/dist /usr/share/nginx/html

# Support client-side routing (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

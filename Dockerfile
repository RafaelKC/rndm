# Build the static site, then serve it with nginx.
# The build stage always runs on the builder's own architecture (the output is plain static files);
# only the nginx stage is per-architecture, so the image runs on amd64 and arm64 servers.
FROM --platform=$BUILDPLATFORM node:24-alpine AS build
WORKDIR /app
# pnpm version comes from "packageManager" in package.json
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/rndm/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

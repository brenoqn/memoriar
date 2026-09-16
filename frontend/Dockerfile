FROM node:24-alpine AS build

WORKDIR /workspace

COPY frontend/package.json frontend/package-lock.json ./frontend/

# Use the exact npm version declared by the frontend package.
RUN npm install --global "$(node -p 'require("./frontend/package.json").packageManager')"

# Build the local file:../shared dependency before installing the frontend.
COPY shared/package.json shared/package-lock.json ./shared/
RUN npm --prefix shared ci
COPY shared/ ./shared/
RUN npm --prefix shared run build

RUN npm --prefix frontend ci
COPY frontend/ ./frontend/
RUN npm --prefix frontend run build

FROM nginx:alpine AS runtime

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/frontend/dist/frontend/browser/ /usr/share/nginx/html/

EXPOSE 80

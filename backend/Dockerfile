FROM node:24-alpine AS build

WORKDIR /workspace

# Build the local file:../shared dependency before installing the backend.
COPY shared/package.json shared/package-lock.json ./shared/
RUN npm --prefix shared ci
COPY shared/ ./shared/
RUN npm --prefix shared run build

COPY backend/package.json backend/package-lock.json ./backend/
RUN npm --prefix backend ci
COPY backend/ ./backend/
RUN npm --prefix backend run build \
    && npm --prefix backend prune --omit=dev

FROM node:24-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /workspace/backend

COPY --from=build /workspace/backend/package.json ./package.json
COPY --from=build /workspace/backend/dist ./dist
COPY --from=build /workspace/backend/node_modules ./node_modules
COPY --from=build /workspace/shared/package.json ../shared/package.json
COPY --from=build /workspace/shared/dist ../shared/dist

USER node
EXPOSE 3001

CMD ["node", "dist/index.js"]


FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /usr/src/client
WORKDIR /usr/src/client

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

ENV VITE_API_HOST=${VITE_API_HOST}

FROM base
COPY --from=prod-deps /usr/src/client/node_modules /usr/src/client/node_modules
COPY --from=build /usr/src/client/dist /usr/src/client/dist
EXPOSE 5173
CMD [ "pnpm", "start" ]
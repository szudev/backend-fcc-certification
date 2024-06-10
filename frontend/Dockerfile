FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV VITE_API_HOST=${VITE_API_HOST}

RUN corepack enable && corepack prepare pnpm@9.2.0 --activate

WORKDIR /usr/src/client

COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM node:20-slim AS final
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.2.0 --activate

WORKDIR /usr/src/client
COPY --from=prod-deps /usr/src/client/node_modules /usr/src/client/node_modules
COPY --from=build /usr/src/client/dist /usr/src/client/dist

EXPOSE 5173

CMD ["pnpm", "start"]


FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CONNECTION_STRING=${CONNECTION_STRING}

RUN corepack enable && corepack prepare pnpm@9.2.0 --activate

WORKDIR /usr/src/api

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

WORKDIR /usr/src/api
COPY --from=prod-deps /usr/src/api/node_modules /usr/src/api/node_modules
COPY --from=build /usr/src/api/dist /usr/src/api/dist

EXPOSE 3000

CMD ["pnpm", "run", "start"]


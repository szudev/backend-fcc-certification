FROM node:20-slim AS production

ENV CONNECTION_STRING=${CONNECTION_STRING}

RUN corepack enable
COPY . /usr/src/backend
WORKDIR /usr/src/backend

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]




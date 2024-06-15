FROM node:20-slim AS production

ARG VITE_API_HOST
ENV VITE_API_HOST=$VITE_API_HOST

RUN corepack enable
COPY . /usr/src/frontend
WORKDIR /usr/src/frontend

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "start"]




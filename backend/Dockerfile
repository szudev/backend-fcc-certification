FROM node:20-slim

ENV NODE_ENV=production
ENV CONNECTION_STRING=${CONNECTION_STRING}

RUN corepack enable

WORKDIR /usr/src/api

COPY . /usr/src/api

EXPOSE 3000

RUN pnpm install

CMD [ "pnpm", "start" ]
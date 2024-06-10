# Use a base image with Node.js
FROM node:20-slim AS base

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CONNECTION_STRING=${CONNECTION_STRING}

# Enable corepack (pnpm)
RUN corepack enable

# Set the working directory
WORKDIR /usr/src/api

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Install all dependencies including devDependencies and build the project
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Final stage: copy built files and production dependencies
FROM node:20-slim AS final
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /usr/src/api
COPY --from=prod-deps /usr/src/api/node_modules /usr/src/api/node_modules
COPY --from=build /usr/src/api/dist /usr/src/api/dist

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]

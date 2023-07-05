### BASE
FROM node:16-alpine AS base
LABEL maintainer "Robert Hamilton <rh@navaris.com>"
# Set the working directory
WORKDIR /appshell
# Install global dependencies
RUN yarn global add dotenv-cli serve npm-run-all

# Expose application port
EXPOSE ${APPSHELL_PORT}

CMD ${APPSHELL_CONTAINER_COMMAND}

### DEPENDENCIES
FROM base AS dependencies
# Copy source
COPY . .
# Install dependencies
RUN yarn --pure-lockfile

### BUILD
FROM dependencies as build
# Validate the build
# todo: add yarn test:ci
RUN yarn lint && yarn build

### RELEASE
FROM base AS production
ARG SOURCE_DIR
ENV SOURCE_DIR=${SOURCE_DIR}
ENV APPSHELL_PORT=${APPSHELL_PORT:-3030}
ENV APPSHELL_CONTAINER_COMMAND=${APPSHELL_CONTAINER_COMMAND:-'yarn serve'}
ENV APPSHELL_REGISTRY=${APPSHELL_REGISTRY:-'/appshell/appshell_registry'}
ENV APPSHELL_ROOT=${APPSHELL_ROOT:-'Appshell/Root'}
ENV APPSHELL_MANIFEST_URL=${APPSHELL_MANIFEST_URL:-'/appshell.manifest.json'}
ENV APPSHELL_ENV_PREFIX=${APPSHELL_ENV_PREFIX}

# Install global dependencies
RUN yarn global add dotenv-cli serve

WORKDIR /appshell/${SOURCE_DIR}

# Symlink resources
RUN ln -s /appshell/${ENV_TARGET}.env .env
RUN ln -s /appshell/appshell_registry ./appshell_registry

COPY --from=build /appshell/${SOURCE_DIR}/package.json .
COPY --from=build /appshell/${SOURCE_DIR}/dist ./dist

COPY --from=build /appshell/packages/cli /appshell/packages/cli
RUN yarn global add file:/appshell/packages/cli

### DEVELOPMENT
FROM base AS development
ARG SOURCE_DIR

# Environment
ENV SOURCE_DIR=${SOURCE_DIR}
ENV APPSHELL_PORT=${APPSHELL_PORT:-3030}
ENV APPSHELL_CONTAINER_COMMAND=${APPSHELL_CONTAINER_COMMAND:-'yarn serve:developer'}
ENV APPSHELL_REGISTRY=${APPSHELL_REGISTRY:-'/appshell/appshell_registry'}
ENV APPSHELL_ROOT=${APPSHELL_ROOT:-'Appshell/Root'}
ENV APPSHELL_MANIFEST_URL=${APPSHELL_MANIFEST_URL:-'/appshell.manifest.json'}
ENV APPSHELL_ENV_PREFIX=${APPSHELL_ENV_PREFIX}

WORKDIR /appshell/${SOURCE_DIR}

# Symlink resources
RUN ln -s /appshell/${ENV_TARGET}.env .env
RUN ln -s /appshell/appshell_registry ./appshell_registry

# Copy dependencies
COPY --from=build /appshell/package.json /appshell/package.json
COPY --from=build /appshell/tsconfig.json /appshell/tsconfig.json
COPY --from=build /appshell/lerna.json /appshell/lerna.json
COPY --from=build /appshell/packages /appshell/packages
COPY --from=build /appshell/node_modules /appshell/node_modules

RUN yarn global add file:/appshell/packages/cli

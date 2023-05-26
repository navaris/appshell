### BASE
FROM node:16-alpine AS base
LABEL maintainer "Robert Hamilton <rh@navaris.com>"

# Set the working directory
WORKDIR /appshell

# Install global dependencies
# RUN yarn global add dotenv-cli serve npm-run-all

### DEPENDENCIES
FROM base AS dependencies
# Copy source
COPY . .
# Install dependencies
RUN yarn --pure-lockfile && yarn bootstrap

### BUILD
FROM dependencies as build
RUN yarn build

### DEVELOPMENT
FROM build AS development

# Environment
ENV APPSHELL_CONFIGS_DIR=${APPSHELL_CONFIGS_DIR:-'/appshell/appshell_configs'}
ENV CONTAINER_COMMAND=${CONTAINER_COMMAND:-'yarn serve'}

ENV SAMPLE_MFE_CONTAINER_PORT=${SAMPLE_MFE_CONTAINER_PORT:-3000}
ENV SAMPLE_MFE_PING_PORT=${SAMPLE_MFE_PING_PORT:-3001}
ENV SAMPLE_MFE_PONG_PORT=${SAMPLE_MFE_PONG_PORT:-3002}

# Expose application ports
EXPOSE ${SAMPLE_MFE_CONTAINER_PORT}
EXPOSE ${SAMPLE_MFE_PING_PORT}
EXPOSE ${SAMPLE_MFE_PONG_PORT}

CMD ${CONTAINER_COMMAND}

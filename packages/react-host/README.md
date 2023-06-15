<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

[![Appshell CI](https://github.com/navaris/appshell/actions/workflows/pipeline.yml/badge.svg)](https://github.com/navaris/appshell/actions/workflows/pipeline.yml)

# @appshell/react-host

Appshell React host for Webpack Module federation micro-frontends.

Working examples can be found [here](https://github.com/navaris/appshell/tree/main/examples).

`@appshell/react-host` is intended to be run as a docker container that dynamically loads your micro-frontends.

## Getting started

Add a section in your docker-compose.yml to start the react host.

```yaml
services:
  appshell:
    image: appshell/react-host-developer # developer image
    # image: appshell/react-host            # production image
    env_file: './${ENV_TARGET}.env'
    deploy:
      mode: replicated
      replicas: ${APPSHELL_CONTAINER_SCALE}
    ports:
      - ${APPSHELL_PORT}:${APPSHELL_PORT}
    volumes:
      - ./${ENV_TARGET}.env/:/appshell/${ENV_TARGET}.env
      - ./appshell_configs:/appshell/appshell_configs
```

> **Note**
> During development, be sure to volume mount your projects appshell_configs directory so the host can generate the global runtime manifest. `./appshell_configs:/appshell/appshell_configs`

```bash
docker compose up appshell
```

## Environment configuration

Add the following properties to your .env

```sh
APPSHELL_PORT=3030
# Location the @appshell/cli processes to generate the global runtime manifest
APPSHELL_CONFIGS_DIR=/appshell/appshell_configs
# Prefix used to specify which env vars to include when generating runtime.env.js. Leaving this empty
# will include ALL variables in the .env
APPSHELL_ENV_PREFIX=APPSHELL_
# Host will fetch the manifest on startup. This can be generated on startup by
# providing $APPSHELL_CONFIGS_DIR, or generated on deployment and referenced by $APPSHELL_MANIFEST_URL.
APPSHELL_MANIFEST_URL=appshell.manifest.json
# Remote module to load from the global runtime manifest
APPSHELL_ROOT=ContainerModule/App
APPSHELL_CONTAINER_SCALE=1
APPSHELL_THEME_COLOR= # Background color of splash screen
APPSHELL_PRIMARY_COLOR= # Color of splash screen loading
ENV_TARGET=

```

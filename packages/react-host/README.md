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
    image: appshell/react-host:developer # developer image
    # image: appshell/react-host            # production image
    env_file: './${ENV_TARGET}.env'
    deploy:
      mode: replicated
      replicas: ${APPSHELL_CONTAINER_SCALE}
    ports:
      - ${APPSHELL_PORT}:${APPSHELL_PORT}
    volumes:
      - ./${ENV_TARGET}.env/:/appshell/${ENV_TARGET}.env
      - ./appshell_registry:/appshell/appshell_registry
```

> **Note**
> During development, volume mount your projects $APPSHELL_REGISTRY directory so the host can generate the global registry index. `./appshell_registry:/appshell/appshell_registry`

```bash
docker compose up appshell
```

## Environment configuration

Add the following properties to your .env

```sh
# Public url. Defaults to localhost
APPSHELL_PUBLIC_URL=
# Port on which the appshell host will run
APPSHELL_PORT=3030
# Location the appshell host processes to generate the global registry index
APPSHELL_REGISTRY=/appshell/appshell_registry
# Remote module to load from the global registry index
APPSHELL_ROOT=ContainerModule/App
# Props to be passed to federated component specified by APPSHELL_ROOT, as a serialized JSON string.
APPSHELL_ROOT_PROPS='{"foo":"bar"}'
# Collection of registries that will be incorporated into the current registry output
APPSHELL_ADJUNCT_REGISTRY=http://prod.url.com/registry ./path/to/appshell_registry
# File to setup the environment. Defaults to .env
APPSHELL_ENV=.env
# Prefix used to specify which env vars to include when generating runtime.env.js. Leaving this empty will include ALL variables in the .env
APPSHELL_ENV_PREFIX=APPSHELL_
# Name of global variable used in the generated runtime.env.js. Defaults to window.__appshell_env__
APPSHELL_ENV_GLOBAL_VAR=__appshell_env__
# Background color of splash screen
APPSHELL_THEME_COLOR=
# Color of splash screen loading
APPSHELL_PRIMARY_COLOR=
# Title of the application
APPSHELL_TITLE=My App
# Description of the application
APPSHELL_DESCRIPTION=Appshell React host

APPSHELL_CONTAINER_SCALE=1
ENV_TARGET=

```

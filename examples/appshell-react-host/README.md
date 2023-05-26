<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

# Example Overview

Consists of 3 micro-frontends, each is configured with `@appshell/manifest-webpack-plugin`.

![Screenshot](https://github.com/navaris/appshell/blob/main/assets/docs/appshell_react_host_screenshot.png 'Screenshot')

## Build time

At build time, each `AppshellManifestPlugin` emits appshell configs into `APPSHELL_CONFIGS_DIR`.

## Runtime

At runtime or deployment, `@appshell/cli` processes `APPSHELL_CONFIGS_DIR` to generate the `global runtime manifest`. In this example, this is done automatically by the appshell react host `@appshell/react-host`

## Metadata

Since you can associate any kind of metadata with each federated module (via `appshell.config.yaml`), you can use the `global runtime manifest` to configure your appshell by supplying routing information, rendering details, etc.

## Consuming federated components

Uses `@appshell/react-federated-component` to dynamically load remote frontends. It uses the remote key to lookup the runtime info for that particular federated component.

```typescript
<Grid>
  <FederatedComponent remote="PingModule/App" />
  <FederatedComponent remote="PongModule/App" />
</Grid>
```

**To run the example**

```bash
cp sample.env .env # create a .env

# 1. start the micro-frontends
# note: the appshell webpack plugins emit configurations to the appshell_configs directory.
docker compose --profile apps up

# OR

npm run start # start locally

# 2. start the appshell host
# note: the host MUST be started after the appshell_configs directory has been populated
#       by the previous step (at least on the initial run) - as the appshell host generates
#       it's manifest file based on the contents of the appshell_configs directory.
docker compose --profile host up
```

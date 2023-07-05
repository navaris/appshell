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

At build time, each `AppshellManifestPlugin` emits an appshell config to `CONFIGS_DIR`.

## Runtime

At runtime or deployment, `@appshell/cli` processes `CONFIGS_DIR` to generate an `appshell manifest` and registers it to `APPSHELL_REGISTRY`. The appshell react host `@appshell/react-host` operates on the contents of the `APPSHELL_REGISTRY` and produces a `global appshell manifest` that is served up to the application at runtime.

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

docker compose --profile host --profile apps up

# OR

npm run bootstrap
npm run start # start locally

# start the appshell host
docker compose --profile host up
```

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

At build time, each `AppshellManifestPlugin` emits an appshell manifest template to the build directory.

## Runtime

At runtime, the config template `dist/appshell.template.json` is processed to generate an `appshell manifest`, which is a final runtime configuration for a given micro-frontend. The appshell manifest is subsequently registered to `APPSHELL_REGISTRY` where it is made available to the appshell host.

The appshell host `@appshell/react-host` produces a `global appshell configuration` that is served up to the application at runtime.

## Metadata

You can associate any kind of metadata with each remote module (via `appshell.config.yaml`) and use the metadata to configure your appshell by supplying routing information, rendering details, etc.

## Consuming federated components

Use `FederatedComponent` from `@appshell/react` to dynamically load remote frontends. It uses the remote key to lookup the runtime info for that particular federated component.

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

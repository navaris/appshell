<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

# Example Overview

Consists of three micro-frontends (1 host and 2 remotes). Each is configured with `@appshell/manifest-webpack-plugin`

At build time, each `AppshellManifestPlugin` emits app-level manifests into  `APPSHELL_CONFIGS_DIR`.

At runtime or deployment, `@appshell/cli` processes `APPSHELL_CONFIGS_DIR` to generate the `global runtime manifest`.

Since you can associate any kind of metadata with each federated module (via `appshell.config.yaml`), you can use the `global runtime manifest` to configure your appshell by supplying routing information, rendering details, etc.

**To run the example**

```bash
npm install # install dependencies

cp sample.env .env # create a .env

npm run build # notice the appshell_configs directory gets created

npm run generate-manifest # appshell.manifest.json is created

npm run start # simple host that fetches the global runtime manifest and displays it

```
<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

[![Appshell CI](https://github.com/navaris/appshell/actions/workflows/pipeline.yml/badge.svg)](https://github.com/navaris/appshell/actions/workflows/pipeline.yml)

# @appshell/react

React utilites for building micro-frontends with Webpack Module federation and Appshell.

Working examples can be found [here](https://github.com/navaris/appshell/tree/main/examples).

## Getting Started

To begin, you'll need to install `@appshell/react`:

```console
npm install @appshell/react --save-dev
```

or

```console
yarn add -D @appshell/react
```

or

```console
pnpm add -D @appshell/react
```

## FederatedComponent

React component that dynamically loads federated components.

```tsx
import { FederatedComponent, ManifestProvider } from '@appshell/react';

<App>
  <ManifestProvider manifest={manifest}>
    <FederatedComponent remote="PingModule/Ping">
    <FederatedComponent remote="PongModule/Pong">
  </ManifestProvider>
</App>
```

## useRegistry

For access to the registry index.

```tsx
import { RegistryProvider, useRegistry } from '@appshell/react';

const MyComponent = () => {
  const index = useRegistry();

  ...
}

<RegistryProvider index={index}>
  <MyComponent />
</RegistryProvider>
```

## useMetadata

For access to the registry metadata.

```tsx
import { MetadataProvider, useMetadata } from '@appshell/react';

const MyComponent = () => {
  const metadata = useMetadata();

  ...
}

<MetadataProvider metadata={metadata}>
  <MyComponent />
</MetadataProvider>
```

## useManifest

For access to the manifest.

```tsx
import { ManifestProvider, useManifest } from '@appshell/react';

const MyComponent = () => {
  const manifest = useManifest();

  ...
}

<ManifestProvider manifest={manifest}>
  <MyComponent />
</ManifestProvider>
```

**Where does the registry come from?**

Currently, the registry is a shared directory or mounted volume. It does support calling an http endpoint, but it has not yet been implemented.

> See [@appshell/cli](https://www.npmjs.com/package/@appshell/cli)

Each micro-frontend registers its manifest with the registry

```bash
appshell register --manifest dist/appshell.manifest.json
```

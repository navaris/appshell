<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

[![Appshell CI](https://github.com/navaris/appshell/actions/workflows/pipeline.yml/badge.svg)](https://github.com/navaris/appshell/actions/workflows/pipeline.yml)

# @appshell/react-federated-component

React utilites for dynamically loading federated components for Webpack Module federation micro-frontends.

Working examples can be found [here](https://github.com/navaris/appshell/tree/main/examples).

## Getting Started

To begin, you'll need to install `@appshell/react-federated-component`:

```console
npm install @appshell/react-federated-component --save-dev
```

or

```console
yarn add -D @appshell/react-federated-component
```

or

```console
pnpm add -D @appshell/react-federated-component
```

## FederatedComponent

React component that dynamically loads federated components.

```tsx
import { FederatedComponent, ManifestProvider } from '@appshell/react-federated-component';

<App>
  <ManifestProvider manifest={manifest}>
    <FederatedComponent remote="PingModule/Ping">
    <FederatedComponent remote="PongModule/Pong">
  </ManifestProvider>
</App>
```

## useManifest

For access to the manifest.

```tsx
import { ManifestProvider, useManifest } from '@appshell/react-federated-component';

const MyComponent = () => {
  const manifest = useManifest();

  ...
}

<ManifestProvider manifest={manifest}>
  <MyComponent />
</ManifestProvider>
```

## jsonResource

Helper function for loading json resources in React Suspense components.

```ts
import { jsonResource } from '@appshell/react-federated-component';

const resource = jsonResource('http://test.com/appshell.manifest.json');

const MyComponent = () => {
  const value = resource.read();

  if (!value) {
    return null;
  }

  if (isError(value)) {
    return <ErrorMessage message={`${value}`} />;
  }

  return <div>my component</div>;
};

<React.Suspense fallback="Loading...">
  <MyComponent />
</React.Suspense>;
```

**Where does the manifest come from?**

> See [@appshell/cli](https://www.npmjs.com/package/@appshell/cli)

```bash
appshell generate manifest --configsDir appshell_configs
```

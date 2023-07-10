<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

[![Appshell CI](https://github.com/navaris/appshell/actions/workflows/pipeline.yml/badge.svg)](https://github.com/navaris/appshell/actions/workflows/pipeline.yml)

# @appshell/loader

Dynamically load federated components for Webpack Module federation micro-frontends.

Working examples can be found [here](https://github.com/navaris/appshell/tree/main/examples).

## Getting Started

To begin, you'll need to install `@appshell/loader`:

```console
npm install @appshell/loader --save-dev
```

or

```console
yarn add -D @appshell/loader
```

or

```console
pnpm add -D @appshell/loader
```

The default export from this package is the loader function. It is given a manifest and returns an async function that can be called to dynamically load federated components.

```ts
import componentLoader from '@appshell/loader';

const load = componentLoader(manifest);

const Component = load<MyComponent>('MyModule/MyComponent');

render(<Component />);
```

**Where does the manifest come from?**

> See [@appshell/cli](https://www.npmjs.com/package/@appshell/cli)

```bash
appshell generate manifest --template dist/appshell.config.json
```

**Do you have any framework specific loaders?**

> See [@appshell/react](https://www.npmjs.com/package/@appshell/react) for a `React` loader.

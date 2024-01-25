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

Dynamically load Appshell components for micro-frontends built with Appshell and Webpack Module federation.

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

The default export from this package is the loader function. It is given the global appshell configuration, and returns an async function that can be called to dynamically load Appshell components.

```ts
import componentLoader from '@appshell/loader';

const load = componentLoader(config);

const Component = load<MyComponent>('MyModule/MyComponent');

render(<Component />);
```

**Where does the global appshell configuration come from?**

> See [@appshell/cli](https://www.npmjs.com/package/@appshell/cli)

```bash
appshell generate global-config --registry appshell_registry_path
```

**Do you have any framework specific loaders?**

> See [@appshell/react](https://www.npmjs.com/package/@appshell/react) for a `React` loader.

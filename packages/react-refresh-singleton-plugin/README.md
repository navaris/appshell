<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

[![Appshell CI](https://github.com/navaris/appshell/actions/workflows/pipeline.yml/badge.svg)](https://github.com/navaris/appshell/actions/workflows/pipeline.yml)

# @appshell/react-refresh-singleton-plugin

A single instance of react-refresh/runtime to enable react-refresh hot module replacement for distributed frontends using Module Federation.

Working examples can be found [here](https://github.com/navaris/appshell/tree/main/examples).

## Getting Started

To begin, you'll need to install `@appshell/react-refresh-singleton-plugin`:

```console
npm install @appshell/react-refresh-singleton-plugin --save-dev
```

or

```console
yarn add -D @appshell/react-refresh-singleton-plugin
```

or

```console
pnpm add -D @appshell/react-refresh-singleton-plugin
```

Then add the plugin to the `webpack` config of each remote app module. For example:

**webpack.config.js**

```js
const ReactRefreshSingleton = require('@appshell/react-refresh-singleton-plugin');

module.exports = {
  plugins: [new ReactRefreshSingleton()],
};
```

## License

[MIT](./LICENSE)

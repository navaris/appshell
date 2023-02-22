[![npm][npm]][npm-url]
[![node][node]][node-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![chat][chat]][chat-url]
[![size][size]][size-url]

# @navaris/appshell-manifest-webpack-plugin

Used to generate a global Appshell manifest for Webpack's Module Federation and provide additional information to the Appshell about remote entrypoints, routing, display names, etc.

## Getting Started

To begin, you'll need to install `@navaris/appshell-manifest-webpack-plugin` and `@navaris/appshell-cli`:

```console
npm install @navaris/appshell-manifest-webpack-plugin @navaris/appshell-cli --save-dev
```

or

```console
yarn add -D @navaris/appshell-manifest-webpack-plugin @navaris/appshell-cli
```

or

```console
pnpm add -D @navaris/appshell-manifest-webpack-plugin @navaris/appshell-cli
```

Then add the plugin to the `webpack` config of each remote app module. For example:

**webpack.config.js**

```js
const AppshellManifestPlugin = require('@navaris/appshell-manifest-webpack-plugin');

module.exports = {
  plugins: [
    new AppshellManifestPlugin({
      config: './path/to/appshell.config.yaml',
      configsDir: '<root>/appshell_configs',
    }),
  ],
};
```

> **Note**
>
> `@navaris/appshell-manifest-webpack-plugin` requires an `appshell.yaml` file in your project directory and the ModuleFederationPlugin.

> **Note**
>
> During the build, the plugin emits manifest files that are subsequently used to generate the global configuration for your Appshell.

> **Note**
>
> Add a post build step like `"generate-manifest": "dotenv -- appshell generate appshell_configs"` to generate the global Appshell manifest.

## Options

- **[`options`](#options-1)**

The plugin's signature:

**webpack.config.js**

```js
const AppshellManifestPlugin = require('@navaris/appshell-manifest-webpack-plugin');

module.exports = {
  plugins: [
    new AppshellManifestPlugin({
      config: './path/to/appshell.config.yaml',
      configsDir: '<root>/appshell_configs',
    }),
  ],
};
```

### `Options`

- [`config`](#config)
- [`configsDir`](#configsDir)

#### `config`

Type:

```ts
type config = string;
```

Default: `appshell.config.yaml`

Location of the `appshell.config.yaml` file.

#### `configsDir`

Type:

```ts
type configsDir = string;
```

Default: `<output-dir>/appshell_configs`

Location where the plugin will write the app manifests. For mono-repo solutions it makes sense to configure a single location for all of the plugins to write. The global Appshell configuration will be generated based on the contents of this directory.

## appshell.config.yaml

Configuration file that associates additional data with each remote defined in the ModuleFederationPlugin.

```yaml
remotes:
  TestModule/Foo: # Must match the scope/module defined in ModuleFederationPlugin
    url: ${APPS_TEST_URL}/remoteEntry.js # Environment variables will be expanded when the global Appshell configuration is generated, typically on start or deployment.
    metadata: # Metadata will be included in the global Appshell configuration
      route: ${FOO_ROUTE}
      displayName: Foo App
      displayGroup: main
      order: 10
      icon: ViewList

  TestModule/Bar:
    url: ${APPS_TEST_URL}/remoteEntry.js
    metadata:
      route: /bar
      displayName: Bar App
      displayGroup: main
      order: 20
      icon: ViewList

  BizModule/Biz:
    url: http://localhost:4040/remoteEntry.js
    metadata:
      route: /biz
      displayName: Biz App
      displayGroup: auxiliary
      order: 30
      icon: ViewList
```

## Sample output

Configure a post build step to generate the Appshell manifest. See `appshell --help` for more information.

```json
{
  "remotes": {
    "CraModule/App": {
      "id": "3eb81a0c",
      "url": "http://localhost:3000/remoteEntry.js",
      "scope": "CraModule",
      "module": "./App",
      "metadata": {
        "route": "/cra",
        "displayName": "Example App",
        "displayGroup": "main",
        "order": 10,
        "icon": "ViewList"
      }
    },
    "VanillaModule/Vanilla": {
      "id": "8232ce86",
      "url": "http://localhost:5000/remoteEntry.js",
      "scope": "VanillaModule",
      "module": "./Vanilla",
      "metadata": {
        "route": "/vanilla",
        "displayName": "Example React App",
        "displayGroup": "main",
        "order": 10,
        "icon": "ViewList"
      }
    }
  },
  "modules": {
    "Appshell": {
      "name": "Appshell",
      "shared": {
        "react": {
          "singleton": true,
          "requiredVersion": "^18.2.0"
        },
        "react-dom": {
          "singleton": true,
          "requiredVersion": "^18.2.0"
        }
      }
    },
    "CraModule": {
      "exposes": {
        "./App": "./src/App"
      },
      "filename": "remoteEntry.js",
      "name": "CraModule",
      "shared": {
        "react": {
          "singleton": true,
          "requiredVersion": "^18.2.0"
        },
        "react-dom": {
          "singleton": true,
          "requiredVersion": "^18.2.0"
        }
      }
    },
    "VanillaModule": {
      "exposes": {
        "./Vanilla": "./src/App"
      },
      "filename": "remoteEntry.js",
      "name": "VanillaModule",
      "shared": {
        "react": {
          "singleton": true,
          "requiredVersion": "^18.2.0"
        },
        "react-dom": {
          "singleton": true,
          "requiredVersion": "^18.2.0"
        }
      }
    }
  }
}
```

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/@navaris/appshell-manifest-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/@navaris/appshell-manifest-webpack-plugin
[node]: https://img.shields.io/node/v/@navaris/appshell-manifest-webpack-plugin.svg
[node-url]: https://nodejs.org
[tests]: https://github.com/navaris/module-federation/packages/appshell-manifest-webpack-plugin/badge.svg
[tests-url]: https://github.com/navaris/module-federation/packages/appshell-manifest-webpack-plugin/actions
[cover]: https://codecov.io/gh/navaris/module-federation/packages/appshell-manifest-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/navaris/module-federation/packages/appshell-manifest-webpack-plugin
[chat]: https://img.shields.io/badge/gitter-webpack%2Fwebpack-brightgreen.svg
[chat-url]: https://gitter.im/navaris/module-federation
[size]: https://packagephobia.now.sh/badge?p=appshell-manifest-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=appshell-manifest-webpack-plugin

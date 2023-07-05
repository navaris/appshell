<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

[![Appshell CI](https://github.com/navaris/appshell/actions/workflows/pipeline.yml/badge.svg)](https://github.com/navaris/appshell/actions/workflows/pipeline.yml)

# @appshell/manifest-webpack-plugin

Emits remote module configurations used to generate a `global runtime manifest` for Webpack Module Federation micro-frontends.

Working examples can be found [here](https://github.com/navaris/appshell/tree/main/examples).

## Getting Started

To begin, you'll need to install `@appshell/manifest-webpack-plugin`:

```console
npm install @appshell/manifest-webpack-plugin --save-dev
```

or

```console
yarn add -D @appshell/manifest-webpack-plugin
```

or

```console
pnpm add -D @appshell/manifest-webpack-plugin
```

Then add the plugin to the `webpack` config of each remote app module. For example:

**webpack.config.js**

```js
const { AppshellManifestPlugin } = require('@appshell/manifest-webpack-plugin');

module.exports = {
  plugins: [
    new AppshellManifestPlugin({
      config: './path/to/appshell.config.yaml',
      configsDir: '<root>/appshell_configs',
    }),
  ],
};
```

**What is appshell.config.yaml?**

> A configuration file consumed by the plugin to provide additional information to the Appshell host about remote entrypoints, routing, display names, etc.

Sample appshell.config.yaml

```yaml
remotes:
  TestModule/Foo: # Must match the scope/module defined in ModuleFederationPlugin
    url: ${APPS_TEST_URL}/remoteEntry.js # Environment variables will be expanded when the global runtime manifest is generated.
    metadata: # Use metadata to provide additional information
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

environment:
  RUNTIME_ARG_1: ${RUNTIME_ARG_1}
  RUNTIME_ARG_2: ${RUNTIME_ARG_2}
  RUNTIME_ARG_3: ${RUNTIME_ARG_3}
```

> **Note** the variable expansion syntax `${CRA_MFE_URL}`. When the `appshell manifest` is generated the actual runtime environment values are injected.

> **Note** the `environment` section defines runtime environment variables that are injected into the global namesapce `window.__appshell_env__[module_name]` when a federated component is loaded. See the examples for a use case.

**What happens at build time?**

> The plugin emits files that are subsequently used to generate the `global appshell manifest` at runtime.

## Sample output

```json
{
  "remotes": {
    "CraModule/App": {
      "url": "${CRA_MFE_URL}",
      "metadata": {
        "route": "/cra",
        "displayName": "Example App",
        "displayGroup": "${CRA_MFE_DISPLAY_GROUP}",
        "order": 10,
        "icon": "ViewList"
      },
      "id": "3eb81a0c"
    }
  },
  "module": {
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
  }
}
```

**How do I generate the global runtime manifest?**

> Use [@appshell/cli](https://www.npmjs.com/package/@appshell/config) in a startup script:

```bash
appshell generate manifest --configsDir appshell_configs
```

**What if I want to generate the global runtime manifest programmatically?**

> Use the `generate` function found in [@appshell/config](https://www.npmjs.com/package/@appshell/config).

```ts
import { generate } from '@appshell/config';

const manifest = generate<MyMetadata>(process.env.CONFIGS_DIR);
```

Sample `global appshell manifest`:

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
  },
  "environment": {
    "CraModule": {
      "RUNTIME_ARG_1": "Foo",
      "RUNTIME_ARG_2": "Biz"
    },
    "VanillaModule": {
      "RUNTIME_ARG_1": "Bar"
    }
  }
}
```

## Options

- **[`options`](#options-1)**

The plugin's signature:

**webpack.config.js**

```js
const { AppshellManifestPlugin } = require('@appshell/manifest-webpack-plugin');

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

Location where the plugin will emit the module configurations. The `appshell manifest` will be generated based on the contents of this directory.

## License

[MIT](./LICENSE)

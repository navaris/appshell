<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

[![Appshell CI](https://github.com/navaris/appshell/actions/workflows/pipeline.yml/badge.svg)](https://github.com/navaris/appshell/actions/workflows/pipeline.yml)

# @appshell/config

Utitliy to generate appshell configuration for building micro-frontends with Appshell and Webpack Module federation.

Working examples can be found [here](https://github.com/navaris/appshell/tree/main/examples).

**Note: This package is no longer published, and it's recommended to use the [@appshell/cli](https://www.npmjs.com/package/@appshell/cli) instead.**

## Getting Started

To begin, you'll need to install `@appshell/config`:

```console
npm install @appshell/config --save-dev
```

or

```console
yarn add -D @appshell/config
```

or

```console
pnpm add -D @appshell/config
```

## Functions

### `generateManifest`

The `generateManifest` function is given a configs dir to process and produces a merged appshell manifest.

```ts
import { generateManifest } from '@appshell/config';

const manifest = generateManifest<MyMetadata>(process.env.CONFIGS_DIR);
```

**Where does the content of CONFIGS_DIR come from?**

> Each micro-frontend configured to use [@appshell/manifest-webpack-plugin](https://www.npmjs.com/package/@appshell/manifest-webpack-plugin) emits it's configuration to the configs directory at build time, which is subsequently processed with this utility to reflect the current runtime environment.

Sample content from CONFIGS_DIR:

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
  },
  "environment": {
    "RUNTIME_ARG_1": "${RUNTIME_ARG_1}",
    "RUNTIME_ARG_2": "${RUNTIME_ARG_2}"
  }
}
```

**How does my runtime environment get reflected in the global appshell manifest?**

> Note the variable expansion syntax `${CRA_MFE_URL}`. When `generateManifest` is called the actual runtime environment values are injected and an appshell manifest is emitted.

> **Note** the `environment` section defines runtime environment variables that are injected into the global namesapce `window.__appshell_env__[module_name]` when an Appshell component is loaded. See the examples for a use case.

Sample appshell manifest produced by the `generateManifest` function:

```json
{
  "remotes": {
    "CraModule/App": {
      "id": "3eb81a0c",
      "url": "http://localhost:3001/remoteEntry.js",
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
      "url": "http://localhost:3002/remoteEntry.js",
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

This `appshell manifest` is registered with `APPSHELL_REGISTRY` consumed by the appshell host.

**What if I want to generate the manifest by a startup script instead?**

> This functionality is exposed by the [@appshell/cli](https://www.npmjs.com/package/@appshell/cli) package. You can simply call `appshell generate manifest --template /path/to/appshell.template.json` to produce the runtime manifest on startup.

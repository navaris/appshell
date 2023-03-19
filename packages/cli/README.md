<div align="center">
  <a href="https://github.com/navaris/appshell">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo-white_2x.png">
      <img alt="appshell" src="https://github.com/navaris/appshell/blob/main/assets/branding/appshell-logo_2x.png">
    </picture>
  </a>
</div>

[![Appshell CI](https://github.com/navaris/appshell/actions/workflows/pipeline.yml/badge.svg)](https://github.com/navaris/appshell/actions/workflows/pipeline.yml)

# @appshell/cli

Utitliy for generating a `global runtime manifest` for Webpack Module federation micro-frontends.

Working examples can be found [here](https://github.com/navaris/appshell/tree/main/examples).

## Getting Started

To begin, you'll need to install `@appshell/cli`:

```console
npm install @appshell/cli --save-dev
```

or

```console
yarn add -D @appshell/cli
```

or

```console
pnpm add -D @appshell/cli
```

## Usage

```bash
appshell generate [target]

Generates a resource

Commands:
  appshell generate manifest  Generate the appshell global runtime manifest
  appshell generate env       Generate the runtime environment js file that refl
                              ects the current process.env

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]
```

## Generate manifest

Generates the appshell global runtime manifest.

```bash
appshell generate manifest

Generate the appshell global runtime manifest

Options:
      --help        Show help                                           [boolean]
      --version     Show version number                                 [boolean]
  -c, --configsDir  Path to the appshell configs dir to process         [string] [default: "appshell_configs"]
  -d, --depth       Depth to search for app manifests in configsDir     [number] [default: 1]
  -o, --outDir      Output location for the appshell manifest           [string] [default: "."]
  -f, --outFile     Output filename for the appshell manifest           [string] [default: "appshell.manifest.json"]
```

### Sample usage

```bash
appshell generate manifest --configsDir /path/to/appshell_configs
```

![Sample APPSHELL_CONFIGS_DIR](https://github.com/navaris/appshell/blob/main/assets/docs/appshell_configs_dir.png 'APPSHELL_CONFIGS_DIR')

**Where does the content of APPSHELL_CONFIGS_DIR come from?**

> Each micro-frontend configured to use [@appshell/manifest-webpack-plugin](https://www.npmjs.com/package/@appshell/manifest-webpack-plugin) emits it's configuration to the configs directory at build time, which is subsequently processed with this utility to reflect the current runtime environment.

Sample content from APPSHELL_CONFIGS_DIR:

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

**How does my runtime environment get reflected in the global runtime manifest?**

> Note the variable expansion syntax `${CRA_MFE_URL}`. When `generate` is called the actual runtime environment values are injected and all configurations are merged into a global runtime manifest.

Sample global runtime manifest produced by the `generate` function:

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
  }
}
```

This global runtime manifest can be consumed by your micro-frontend Appshell host and used to configure the Appshell accordingly.

**What if I want to generate the manifest programmatically instead?**

> This functionality is exposed by the [@appshell/config](https://www.npmjs.com/package/@appshell/config) package.

## Generate runtime env

Generates a runtime env js file that can be consumed by the application at runtime.

```bash
appshell generate env

Generate the runtime environment js file that reflects the current process.env

Options:
      --help     Show help                                                  [boolean]
      --version  Show version number                                        [boolean]
  -e, --env      The .env file to process                                   [string] [default: ".env"]
  -o, --outDir   Output location for the runtime environment js             [string] [default: "."]
  -f, --outFile  Output filename for the runtime environment js             [string] [default: "runtime.env.js"]
  -p, --prefix   Only capture environment variables that start with prefix  [string] [default: ""]
  -g, --globalName     Global variable name window[globalName] used in the output js    [string] [default: "appshell_env"]
```

### Sample usage

```bash
appshell generate env -e .env --prefix APPSHELL_ --outDir dist
```

Sample output `runtime.env.js`

```js
window.appshell_env = {
  APPSHELL_VAR_1 = 'val 1',
  APPSHELL_VAR_2 = 'val 2'
};
```

Include in the public html

```html
<script src="runtime.env.js"></script>
```

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

Utility for building micro-frontends with Appshell and Webpack Module federation.

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
appshell [command]

Commands:
  appshell generate [target]  Generates a resource
  appshell register           Register one or more appshell manifests
  appshell start              Start the appshell runtime environment
```

### appshell generate

```bash
appshell generate [target]

Generates a resource

Commands:
  appshell generate manifest  Generate the appshell manifest by processing the template specified by --template
  appshell generate env       Generate the runtime environment js file that reflects the current process.env
  appshell generate global-config     Generate the global appshell configuration file by merging sources specifed by --registry options
  appshell generate metadata  Generate the appshell metadata file by merging sources specifed by --registry options
```

## Generate manifest

Generates the appshell global runtime manifest.

```bash
appshell generate manifest

Generate the appshell global runtime manifest

Options:
      --help        Show help                                           [boolean]
      --version     Show version number                                 [boolean]
  -t, --template  Path to the appshell config template to process     [string] [default: "appshell.template.json"]
  -o, --outDir      Output location for the appshell manifest           [string] [default: "dist"]
  -f, --outFile     Output filename for the appshell manifest           [string] [default: "appshell.manifest.json"]
```

### Sample usage

```bash
appshell generate manifest --template dist/appshell.template.json
```

**Where does the content of APPSHELL_REGISTRY come from?**

> Each micro-frontend configured to use [@appshell/manifest-webpack-plugin](https://www.npmjs.com/package/@appshell/manifest-webpack-plugin) emits a manifest template, which is subsequently used to generate a manifest for the remote module. This manifest is then registered with the APPSHELL_REGISTRY.

Sample config template `appshell.template.json`:

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

**How does my runtime environment get reflected in the appshell manifest?**

> Note the variable expansion syntax `${CRA_MFE_URL}`. When `appshell generate manifest` is called the actual runtime environment values are injected in order to produce the remote module's appshell manifest.

> **Note** the `environment` section defines runtime environment variables that are injected into the global namesapce `window.__appshell_env__[module_name]` when a federated component is loaded. See the examples for a use case.

Sample appshell manifest produced by the `appshell generate manifest` function:

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

This appshell manifest is registered with `APPSHELL_REGISTRY` and subsequently consumed by the Appshell host.

## Register a manifest

Register one or more appshell manifests with the global registry.

```bash
appshell register

Register one or more appshell manifests

Options:
      --help      Show help                                            [boolean]
      --version   Show version number                                  [boolean]
  -m, --manifest  One or more manifests to register                      [array]
  -r, --registry  Registry path for the appshell manifests
                                         [string] [default: "appshell_registry"]
```

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
  -g, --globalName     Global variable name window[globalName] used in the output js    [string] [default: "__appshell_env__"]
```

### Sample usage

```bash
appshell generate env -e .env --prefix APPSHELL_ --outDir dist
```

Sample output `runtime.env.js`

```js
window.__appshell_env__ = {
  APPSHELL_VAR_1 = 'val 1',
  APPSHELL_VAR_2 = 'val 2'
};
```

Include in the public html

```html
<script src="runtime.env.js"></script>
```

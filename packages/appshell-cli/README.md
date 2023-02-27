# @navaris/appshell-cli

CLI utility for generating the global Appshell configuration for Webpack Module Federation. This utility works in conjunction with `@navaris/appshell-manifest-webpack-plugin`.

## Getting Started

To begin, you'll need to install `@navaris/appshell-cli`:

```console
npm install @navaris/appshell-cli --save-dev
```

or

```console
yarn add -D @navaris/appshell-cli
```

or

```console
pnpm add -D @navaris/appshell-cli
```

## Usage

```bash
appshell [command]

Commands:
  appshell generate [target] [options]  supported targets: 'manifest'

Options:
      --help        Show help                                          [boolean]
      --version     Show version number                                [boolean]
  -c, --configsDir  Path to configs dir to process
                                          [string] [default: "appshell_configs"]
  -d, --depth       Depth to search for app manifests to include
                                                           [number] [default: 1]
  -o, --outDir      Output location for the appshell manifest
                                                         [string] [default: "."]
  -f, --outFile     Output filename for the appshell manifest
                                    [string] [default: "appshell.manifest.json"]
```

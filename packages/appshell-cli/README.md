# @navaris/appshell-cli

CLI utility for generating the global configuration for an Appshell host using Webpack's Module Federation. This utility works in conjunction with `@navaris/appshell-manifest-webpack-plugin`.

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
  appshell generate [configsDir] [options]  generate the global appshell config

Options:
      --help     Show help [boolean]
      --version  Show version number [boolean]
  -d, --depth    Depth to search for app manifests to include [number][default: 1]
  -o, --outDir   Output location for the appshell manifest [string][default: "."]
  -f, --outFile  Output filename for the appshell manifest [string]  [default: "appshell.manifest.json"]
```

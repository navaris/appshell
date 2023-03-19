#!/usr/bin/env node

/**
 * @appshell/cli package API
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import generateEnvHandler, { GenerateEnvArgs } from './handlers/generate.env';
import generateManifestHandler, { GenerateManifestArgs } from './handlers/generate.manifest';

const generateManifestCommand: yargs.CommandModule<unknown, GenerateManifestArgs> = {
  command: 'manifest',
  describe: 'Generate the appshell global runtime manifest',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('configsDir', {
        alias: 'c',
        default: 'appshell_configs',
        type: 'string',
        description: 'Path to the appshell configs dir to process',
      })
      .option('depth', {
        alias: 'd',
        default: 1,
        type: 'number',
        description: 'Depth to search for app manifests in configsDir',
      })
      .option('outDir', {
        alias: 'o',
        default: '.',
        requiresArg: true,
        type: 'string',
        description: 'Output location for the appshell manifest',
      })
      .option('outFile', {
        alias: 'f',
        default: 'appshell.manifest.json',
        type: 'string',
        description: 'Output filename for the appshell manifest',
      }),
  handler: generateManifestHandler,
};

const generateEnvCommand: yargs.CommandModule<unknown, GenerateEnvArgs> = {
  command: 'env',
  describe: 'Generate the runtime environment js file that reflects the current process.env',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('env', {
        alias: 'e',
        default: '.env',
        type: 'string',
        description: 'The .env file to process',
      })
      .option('outDir', {
        alias: 'o',
        default: '.',
        requiresArg: true,
        type: 'string',
        description: 'Output location for the runtime environment js',
      })
      .option('outFile', {
        alias: 'f',
        default: 'runtime.env.js',
        type: 'string',
        description: 'Output filename for the runtime environment js',
      })
      .option('prefix', {
        alias: 'p',
        default: '',
        type: 'string',
        description: 'Only capture environment variables that start with prefix',
      })
      .option('globalName', {
        alias: 'g',
        default: 'appshell_env',
        type: 'string',
        description: 'Global variable name window[globalName] used in the output js',
      }),
  handler: generateEnvHandler,
};

yargs(hideBin(process.argv))
  .command({
    command: 'generate [target]',
    describe: 'Generates a resource',
    handler: () => {},
    // eslint-disable-next-line @typescript-eslint/no-shadow
    builder: (yargs) =>
      yargs.command(generateManifestCommand).command(generateEnvCommand).demandCommand(),
  })
  .parse();

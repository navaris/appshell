#!/usr/bin/env node

/**
 * @appshell/cli package API
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import generateEnvHandler, { GenerateEnvArgs } from './handlers/generate.env';
import generateIndexHandler, { GenerateIndexArgs } from './handlers/generate.index';
import generateManifestHandler, { GenerateManifestArgs } from './handlers/generate.manifest';
import generateMetadataHandler, { GenerateMetadataArgs } from './handlers/generate.metadata';
import registerManifestHandler, { RegisterManifestArgs } from './handlers/register';
import startHandler, { StartArgs } from './handlers/start';

const startCommand: yargs.CommandModule<unknown, StartArgs> = {
  command: 'start',
  describe: 'Start the appshell runtime environment',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('outDir', {
        alias: 'o',
        default: 'dist',
        type: 'string',
        description: 'Output directory for files',
      })
      .option('env', {
        alias: 'e',
        default: '.env',
        type: 'string',
        description: 'The .env file to process',
      })
      .option('envPrefix', {
        alias: 'p',
        default: '',
        type: 'string',
        description: 'Only capture environment variables that start with prefix',
      })
      .option('envGlobalName', {
        alias: 'g',
        default: '__appshell_env__',
        type: 'string',
        description: 'Global variable name window[globalName] used in the output js',
      })
      .option('remote', {
        default: false,
        type: 'boolean',
        description: 'Flag if this app is a remote',
      })
      .option('host', {
        default: false,
        type: 'boolean',
        description: 'Flag if this app is a host',
      })
      .option('metadata', {
        default: false,
        type: 'boolean',
        description: 'Flag if metadata should be produced',
      })
      .option('config', {
        alias: 'c',
        default: 'appshell.config.json',
        type: 'string',
        description: 'Path to the appshell config to process',
      })
      .option('manifest', {
        alias: 'm',
        default: 'appshell.manifest.json',
        type: 'string',
        description: 'One or more manifests to register',
      })
      .option('registry', {
        alias: 'r',
        default: './appshell_registry',
        type: 'string',
        description: 'Registry with which the app is registered',
      })
      .option('adjunctRegistry', {
        alias: 'a',
        default: [],
        string: true,
        type: 'array',
        description: 'One or more adjunct registries to incorporate',
      }),
  handler: startHandler,
};

const registerManifestCommand: yargs.CommandModule<unknown, RegisterManifestArgs> = {
  command: 'register',
  describe: 'Register one or more appshell manifests',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('manifest', {
        alias: 'm',
        type: 'array',
        requiresArg: true,
        description: 'One or more manifests to register',
      })
      .option('registry', {
        alias: 'r',
        default: 'appshell_registry',
        type: 'string',
        description: 'Registry path for the appshell manifests',
      }),
  handler: registerManifestHandler,
};

const generateIndexCommand: yargs.CommandModule<unknown, GenerateIndexArgs> = {
  command: 'index',
  describe: 'Generate the appshell index file by merging sources specifed by --registry options',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('outDir', {
        alias: 'o',
        default: 'dist',
        type: 'string',
        description: 'Output location for the appshell index',
      })
      .option('outFile', {
        alias: 'f',
        default: 'appshell.index.json',
        type: 'string',
        description: 'Output filename for the appshell index',
      })
      .option('registry', {
        alias: 'r',
        string: true,
        type: 'array',
        requiresArg: true,
        description: 'One or more registies to merge into a single appshell index',
      }),
  handler: generateIndexHandler,
};

const generateMetadataCommand: yargs.CommandModule<unknown, GenerateMetadataArgs> = {
  command: 'metadata',
  describe: 'Generate the appshell metadata file by merging sources specifed by --registry options',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('outDir', {
        alias: 'o',
        default: 'dist',
        requiresArg: true,
        type: 'string',
        description: 'Output location for the appshell manifest',
      })
      .option('outFile', {
        alias: 'f',
        default: 'appshell.metadata.json',
        type: 'string',
        description: 'Output filename for the appshell manifest',
      })
      .option('registry', {
        alias: 'r',
        type: 'array',
        requiresArg: true,
        description: 'One or more registies to merge into a single appshell index',
      }),
  handler: generateMetadataHandler,
};

const generateManifestCommand: yargs.CommandModule<unknown, GenerateManifestArgs> = {
  command: 'manifest',
  describe: 'Generate the appshell manifest by processing the template specified by --config',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('config', {
        alias: 'c',
        default: 'appshell.config.json',
        type: 'string',
        description: 'Path to the appshell config to process',
      })
      .option('outDir', {
        alias: 'o',
        default: 'dist',
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
        default: 'dist',
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
      })
      .option('overwrite', {
        alias: 'w',
        default: false,
        type: 'boolean',
        description:
          'If true, values in --env take precendent over those currently set in the environment',
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
      yargs
        .command(generateManifestCommand)
        .command(generateEnvCommand)
        .command(generateIndexCommand)
        .command(generateMetadataCommand)
        .demandCommand(),
  })
  .command(registerManifestCommand)
  .command(startCommand)
  .parse();

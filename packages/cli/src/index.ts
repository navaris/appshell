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
import mergeManifestHandler, { MergeManifestArgs } from './handlers/merge.manifest';
import registerManifestHandler, { RegisterManifestArgs } from './handlers/register.manifest';

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

const mergeManifestCommand: yargs.CommandModule<unknown, MergeManifestArgs> = {
  command: 'merge',
  describe: 'Merge one or more appshell manifests',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
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
      })
      .option('manifest', {
        alias: 'm',
        type: 'array',
        requiresArg: true,
        description: 'One or more manifests to merge into a single appshell manifest',
      }),
  handler: mergeManifestHandler,
};

const generateIndexCommand: yargs.CommandModule<unknown, GenerateIndexArgs> = {
  command: 'index',
  describe: 'Generate the appshell index',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('outDir', {
        alias: 'o',
        default: '.',
        requiresArg: true,
        type: 'string',
        description: 'Output location for the appshell index',
      })
      .option('outFile', {
        alias: 'f',
        default: 'appshell.index.js',
        type: 'string',
        description: 'Output filename for the appshell index',
      })
      .option('registry', {
        alias: 'r',
        type: 'array',
        requiresArg: true,
        description: 'One or more registies to merge into a single appshell index',
      }),
  handler: generateIndexHandler,
};

const generateMetadataCommand: yargs.CommandModule<unknown, GenerateMetadataArgs> = {
  command: 'metadata',
  describe: 'Generate the appshell metadata',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('outDir', {
        alias: 'o',
        default: '.',
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
  describe: 'Generate the appshell manifest',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('config', {
        alias: 'c',
        default: 'appshell.config.yaml',
        type: 'string',
        description: 'Path to the appshell config to process',
      })
      .option('webpack', {
        alias: 'w',
        default: 'webpack.config.js',
        type: 'string',
        description: 'Path to the webpack config',
      })
      .option('env', {
        alias: 'e',
        type: 'array',
        description: '--env values will be passed to the webpack config',
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
      yargs
        .command(generateManifestCommand)
        .command(generateEnvCommand)
        .command(generateIndexCommand)
        .command(generateMetadataCommand)
        .demandCommand(),
  })
  .command(mergeManifestCommand)
  .command(registerManifestCommand)
  .parse();

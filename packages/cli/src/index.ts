#!/usr/bin/env node

/**
 * @appshell/cli package API
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import deregisterManifestHandler, { DeregisterManifestArgs } from './handlers/deregister';
import generateEnvHandler, { GenerateEnvArgs } from './handlers/generate.env';
import generateManifestHandler, { GenerateManifestArgs } from './handlers/generate.manifest';
import generateRegisterHandler, { GenerateRegisterArgs } from './handlers/generate.register';
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
      .option('validateRegistrySslCert', {
        alias: 'v',
        default: true,
        type: 'boolean',
        description:
          "If false, registry files are fetched without validating the registry's SSL cert",
      })
      .option('metadata', {
        default: false,
        type: 'boolean',
        description: 'Flag if metadata should be produced',
      })
      .option('manifestTemplate', {
        alias: 't',
        default: 'appshell.template.json',
        type: 'string',
        description: 'Path to the appshell config template to process',
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
        string: true,
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

const deregisterManifestCommand: yargs.CommandModule<unknown, DeregisterManifestArgs> = {
  command: 'deregister',
  describe: 'Deregister one or more appshell manifests',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('key', {
        alias: 'k',
        string: true,
        type: 'array',
        requiresArg: true,
        description: 'One or more keys for manifests to deregister',
      })
      .option('registry', {
        alias: 'r',
        default: 'appshell_registry',
        type: 'string',
        description: 'Registry path for the appshell manifests',
      }),
  handler: deregisterManifestHandler,
};

const generateRegisterCommand: yargs.CommandModule<unknown, GenerateRegisterArgs> = {
  command: 'register',
  describe: 'Generate the appshell register by merging sources specifed by --registry options',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('outDir', {
        alias: 'o',
        default: 'dist',
        type: 'string',
        description: 'Output location for the appshell register',
      })
      .option('outFile', {
        alias: 'f',
        default: 'appshell.register.json',
        type: 'string',
        description: 'Output filename for the appshell register',
      })
      .option('validateRegistrySslCert', {
        alias: 'v',
        default: true,
        type: 'boolean',
        description:
          "If false, registry files are fetched without validating the registry's SSL cert",
      })
      .option('registry', {
        alias: 'r',
        string: true,
        type: 'array',
        requiresArg: true,
        description: 'One or more registies to merge into a single appshell register',
      }),
  handler: generateRegisterHandler,
};

const generateManifestCommand: yargs.CommandModule<unknown, GenerateManifestArgs> = {
  command: 'manifest',
  describe: 'Generate the appshell manifest by processing the template specified by --template',
  // eslint-disable-next-line @typescript-eslint/no-shadow
  builder: (yargs) =>
    yargs
      .option('template', {
        alias: 't',
        default: 'appshell.template.json',
        type: 'string',
        description: 'Path to the appshell config template to process',
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
        default: '__appshell_env__',
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
        .command(generateRegisterCommand)
        .demandCommand(),
  })
  .command(registerManifestCommand)
  .command(deregisterManifestCommand)
  .command(startCommand)
  .parse();

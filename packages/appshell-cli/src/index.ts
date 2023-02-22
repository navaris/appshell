#!/usr/bin/env node

import { generate } from '@navaris/appshell-utils';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
  .command(
    'generate [configsDir] [options]',
    'generate the global appshell config',
    // eslint-disable-next-line @typescript-eslint/no-shadow
    (yargs) => {
      return yargs.positional('configsDir', {
        type: 'string',
        requiresArg: true,
        describe: 'configs directory to process',
      });
    },
    (
      argv: yargs.ArgumentsCamelCase<{
        configsDir: string | undefined;
        depth: number;
        outDir: string;
        outFile: string;
      }>,
    ) => {
      if (argv.configsDir) {
        const outDir = argv.outDir;
        const filename = argv.outFile;

        console.log(`generating ${filename} configsDir=${argv.configsDir} --outDir=${outDir}`);

        const config = generate(argv.configsDir, argv.depth);

        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir);
        }
        fs.writeFileSync(path.join(outDir, filename), JSON.stringify(config));
      }
    },
  )
  .option('depth', {
    alias: 'd',
    default: 1,
    type: 'number',
    description: 'Depth to search for app manifests to include',
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
  })
  .parse();

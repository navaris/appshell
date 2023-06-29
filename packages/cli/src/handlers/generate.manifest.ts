/* eslint-disable no-console */
import { generate } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateManifestArgs = {
  configsDir: string;
  depth: number;
  outDir: string;
  outFile: string;
};

export default (argv: GenerateManifestArgs) => {
  const { configsDir, depth, outDir, outFile } = argv;

  try {
    console.log(
      `generating manifest --configsDir=${configsDir} --outDir=${outDir} --outFile=${outFile}`,
    );

    if (!fs.existsSync(configsDir)) {
      console.log(`configsDir not found '${configsDir}'. skipping manifest generation.`);
    } else {
      const config = generate(configsDir, depth);

      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
      }
      fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(config));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating manifest', err.message);
  }
};

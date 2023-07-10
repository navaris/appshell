/* eslint-disable no-console */
import { generateManifest } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateManifestArgs = {
  config: string;
  outDir: string;
  outFile: string;
};

export default async (argv: GenerateManifestArgs) => {
  const { config, outDir, outFile } = argv;

  try {
    console.log(`generating manifest --config=${config} --out-dir=${outDir} --out-file=${outFile}`);

    if (!fs.existsSync(config)) {
      console.log(`config not found '${config}'. skipping manifest generation.`);
    } else {
      const manifest = await generateManifest(config);

      if (manifest) {
        if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir);
        }
        fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(manifest));
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating manifest', err.message);
  }
};

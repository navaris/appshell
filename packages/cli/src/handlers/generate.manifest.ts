/* eslint-disable no-console */
import { generateManifest } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateManifestArgs = {
  template: string;
  outDir: string;
  outFile: string;
};

export default async (argv: GenerateManifestArgs) => {
  const { template, outDir, outFile } = argv;

  try {
    console.log(
      `generating manifest --template=${template} --out-dir=${outDir} --out-file=${outFile}`,
    );

    if (!fs.existsSync(template)) {
      console.log(`template not found '${template}'. skipping manifest generation.`);
    } else {
      const manifest = await generateManifest(template);

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

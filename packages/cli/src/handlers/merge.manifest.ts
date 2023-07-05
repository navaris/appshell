/* eslint-disable no-console */
import { utils } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type MergeManifestArgs = {
  manifest: (string | number)[] | undefined;
  outDir: string;
  outFile: string;
};

export default async (argv: MergeManifestArgs) => {
  const { manifest, outDir, outFile } = argv;
  const manifests = (manifest as string[]) || [];
  if (manifests.length < 1) {
    console.log(`No manifests found. skipping manifest merge.`);
    return;
  }

  console.log(`merging manifests --outDir=${outDir} --outFile=${outFile} --manifest=${manifests}`);

  try {
    const docs = await Promise.all(manifests.map(utils.loadJson)).then((items) => items.flat());
    console.log(`Merging ${docs.length} manifests from:`, JSON.stringify(manifests, null, 2));

    const merged = utils.merge({ validate: () => true }, ...docs);

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }
    fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(merged));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error merging manifests', err.message);
  }
};

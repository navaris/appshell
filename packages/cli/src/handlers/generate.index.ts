/* eslint-disable no-console */
import { generateIndex } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateIndexArgs = {
  registry: (string | number)[] | undefined;
  outDir: string;
  outFile: string;
};

export default async (argv: GenerateIndexArgs): Promise<void> => {
  const { registry, outDir, outFile } = argv;
  const registries = (registry as string[]) || [];

  if (registries.length < 1) {
    console.log(`No registries found. skipping index generation.`);
    return;
  }

  console.log(
    `generating appshell index --outDir=${outDir} --outFile=${outFile} --registry=${registries}`,
  );

  try {
    const index = await generateIndex(registries);

    console.log(`appshell index generated: ${JSON.stringify(index, null, 2)}`);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(index));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating appshell index', err.message);
  }
};

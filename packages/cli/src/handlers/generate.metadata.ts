import { generateMetadata } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateMetadataArgs = {
  registry: (string | number)[] | undefined;
  insecure: boolean;
  outDir: string;
  outFile: string;
};

export default async (argv: GenerateMetadataArgs): Promise<void> => {
  const { registry, insecure, outDir, outFile } = argv;
  const registries = registry as string[];

  // eslint-disable-next-line no-console
  console.log(
    `generating appshell metadata --registry=${registries} --insecure=${insecure} --out-dir=${outDir} --out-file=${outFile}`,
  );

  const metadata = await generateMetadata(registries, { insecure });

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(metadata));
};

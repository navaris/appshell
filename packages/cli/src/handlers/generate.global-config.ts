/* eslint-disable no-console */
import { generateGlobalConfig } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateGlobalConfigArgs = {
  registry: string[] | undefined;
  validateRegistrySslCert: boolean;
  outDir: string;
  outFile: string;
};

export default async (argv: GenerateGlobalConfigArgs): Promise<void> => {
  const { registry, validateRegistrySslCert, outDir, outFile } = argv;
  const registries = registry || [];

  if (registries.length < 1) {
    console.log(`No registries found. skipping global configuration generation.`);
    return;
  }

  console.log(
    `generating global appshell configuration --validate-registry-ssl-cert=${validateRegistrySslCert} --out-dir=${outDir} --out-file=${outFile} --registry=${registries}`,
  );

  try {
    const config = await generateGlobalConfig(registries, { insecure: !validateRegistrySslCert });

    console.log(`global appshell configuration generated: ${JSON.stringify(config, null, 2)}`);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(config));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating global appshell configuration', err.message);
  }
};

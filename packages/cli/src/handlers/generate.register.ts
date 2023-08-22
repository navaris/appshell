/* eslint-disable no-console */
import { generateRegister } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateRegisterArgs = {
  registry: string[] | undefined;
  validateRegistrySslCert: boolean;
  outDir: string;
  outFile: string;
};

export default async (argv: GenerateRegisterArgs): Promise<void> => {
  const { registry, validateRegistrySslCert, outDir, outFile } = argv;
  const registries = registry || [];

  if (registries.length < 1) {
    console.log(`No registries found. skipping register generation.`);
    return;
  }

  console.log(
    `generating appshell register --validate-registry-ssl-cert=${validateRegistrySslCert} --out-dir=${outDir} --out-file=${outFile} --registry=${registries}`,
  );

  try {
    const register = await generateRegister(registries, { insecure: !validateRegistrySslCert });

    console.log(`appshell register generated: ${JSON.stringify(register, null, 2)}`);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    fs.writeFileSync(path.join(outDir, outFile), JSON.stringify(register));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error generating appshell index', err.message);
  }
};

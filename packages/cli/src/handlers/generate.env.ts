import { generateEnv } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateEnvArgs = {
  env: string;
  outDir: string;
  outFile: string;
  prefix: string;
  globalName: string;
  overwrite: boolean;
};

export default async (argv: GenerateEnvArgs): Promise<void> => {
  const { env, globalName, outDir, outFile, prefix, overwrite } = argv;
  // eslint-disable-next-line no-console
  console.log(
    `generating runtime env js --env=${env} --prefix=${prefix} --out-dir=${outDir} --out-file=${outFile} --global-name=${globalName} --overwrite=${overwrite}`,
  );

  const environment = await generateEnv(env, prefix, overwrite);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  return new Promise<void>((resolve) => {
    const outputFile = fs.createWriteStream(path.join(outDir, outFile));

    outputFile.write(`window.${globalName} = {\n`);

    environment.forEach((value, key) => {
      let formattedValue: string | number = parseFloat(value);
      if (Number.isNaN(formattedValue)) {
        formattedValue = `'${value.replaceAll("'", '')}'`;
      }
      outputFile.write(`\t${key}: ${formattedValue},\n`);
    });

    outputFile.end('}', resolve);
  });
};

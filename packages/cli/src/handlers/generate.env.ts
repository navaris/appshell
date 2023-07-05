import { generateEnv } from '@appshell/config';
import fs from 'fs';
import path from 'path';

export type GenerateEnvArgs = {
  env: string;
  outDir: string;
  outFile: string;
  prefix: string;
  globalName: string;
};

export default async (argv: GenerateEnvArgs): Promise<void> => {
  const { env, globalName, outDir, outFile, prefix } = argv;
  // eslint-disable-next-line no-console
  console.log(
    `generating runtime env js --env=${env} --prefix=${prefix} --outDir=${outDir} --outFile=${outFile} --globalName=${globalName}`,
  );

  const environment = await generateEnv(env, prefix);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  return new Promise<void>((resolve) => {
    const outputFile = fs.createWriteStream(path.join(outDir, outFile));

    outputFile.write(`window.${globalName} = {\n`);

    environment.forEach((value, key) => {
      outputFile.write(`\t${key}: '${value}',\n`);
    });

    outputFile.end('}', resolve);
  });
};

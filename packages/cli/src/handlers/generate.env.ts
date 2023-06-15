import fs from 'fs';
import path from 'path';
import readline from 'readline';

export type GenerateEnvArgs = {
  env: string;
  outDir: string;
  outFile: string;
  prefix: string;
  globalName: string;
};

const shouldProcess = (line: string, prefixRegex: RegExp) =>
  !line.match(/^(\s*|#.*)$/) && prefixRegex.test(line);

export default async (argv: GenerateEnvArgs): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    const { env, globalName, outDir, outFile, prefix } = argv;

    // eslint-disable-next-line no-console
    console.log(
      `generating runtime env js --env=${env} --prefix=${prefix} --outDir=${outDir} --outFile=${outFile} --globalName=${globalName}`,
    );

    const dotenvPath = path.resolve(env);
    if (fs.existsSync(dotenvPath)) {
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      const prefixRegex = new RegExp(`^${prefix}.*$`);
      const outputFile = fs.createWriteStream(path.join(outDir, outFile));
      const stream = fs.createReadStream(dotenvPath);
      const rl = readline.createInterface({
        input: stream,
        output: process.stdout,
      });

      outputFile.write(`window.${globalName} = {\n`);

      rl.on('line', (line) => {
        if (shouldProcess(line, prefixRegex)) {
          const [NAME, VALUE] = line.split('=');
          let currentValue = process.env[NAME];
          if (!currentValue) {
            currentValue = VALUE;
          }
          outputFile.write(`\t${NAME}: "${currentValue}",\n`);
        }
      });

      rl.on('close', () => {
        outputFile.end('}', resolve);
      });
    } else {
      reject(new Error(`${env} not found.`));
    }
  });

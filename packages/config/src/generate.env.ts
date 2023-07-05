import fs from 'fs';
import path from 'path';
import readline from 'readline';

const shouldProcess = (line: string, prefixRegex: RegExp) =>
  !line.match(/^(\s*|#.*)$/) && prefixRegex.test(line);

export default async (env: string, prefix = '') =>
  new Promise<Map<string, string | number | undefined>>((resolve, reject) => {
    const map = new Map<string, string | number | undefined>();
    const dotenvPath = path.resolve(env);

    if (fs.existsSync(dotenvPath)) {
      const prefixRegex = new RegExp(`^${prefix}.*$`);
      const stream = fs.createReadStream(dotenvPath);
      const rl = readline.createInterface({
        input: stream,
      });

      rl.on('line', (line) => {
        if (shouldProcess(line, prefixRegex)) {
          const [NAME, VALUE] = line.split('=');
          let currentValue = process.env[NAME];
          if (!currentValue) {
            currentValue = VALUE;
          }
          map.set(NAME, currentValue);
        }
      });

      rl.on('close', () => {
        resolve(map);
      });
    } else {
      reject(new Error(`${env} not found.`));
    }
  });

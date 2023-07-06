import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export type StartArgs = {
  outDir: string;
  env: string;
  envPrefix: string;
  envGlobalName: string;

  remote: boolean;
  host: boolean;
  config: string;
  manifest: string;
  registry: string;
  index: (string | number)[];
};

export default async (argv: StartArgs): Promise<void> => {
  const { env, envGlobalName, envPrefix, outDir, remote, host, manifest, config, registry, index } =
    argv;

  // eslint-disable-next-line no-console
  console.log(
    `starting appshell
      --env=${env}
      --env-prefix=${envPrefix}
      --env-global-name=${envGlobalName}
      --outDir=${outDir}
      --remote=${remote}
      --host=${host}
      --manifest=${manifest}
      --config=${config}
      --registry=${registry}
      --index=${index}`,
  );

  if (remote) {
    const prefix = 'appshell remote';
    const configPath = path.join(outDir, config);
    const manifestPath = path.join(outDir, manifest);
    const configDirname = path.dirname(configPath);

    if (!fs.existsSync(configDirname)) {
      fs.mkdirSync(configDirname);
      fs.writeFileSync(configPath, '');
    }

    const clientProcess = exec(
      `npm exec -- nodemon --watch ${configPath} --exec "appshell generate manifest --config ${configPath} && appshell register --manifest ${manifestPath} --registry ${registry}"`,
    );
    clientProcess.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });
  }

  if (host) {
    const prefix = 'appshell host';
    const sources = index.concat(registry);
    exec(
      `appshell generate env -e ${env} --prefix ${envPrefix} --globalName ${envGlobalName}`,
      (error, stdout, stderr) => {
        if (error) {
          // eslint-disable-next-line no-console
          console.error(`${prefix}: ${error}`);
          return;
        }
        // eslint-disable-next-line no-console
        console.log(`${prefix}: ${stdout}`);
        // eslint-disable-next-line no-console
        console.error(`${prefix}: ${stderr}`);
      },
    );

    if (!fs.existsSync(registry)) {
      fs.mkdirSync(registry);
    }
    const hostProcess = exec(
      `npm exec -- nodemon --watch ${registry} --ext json --exec "appshell generate index --registry ${sources}"`,
    );
    hostProcess.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });
  }
};

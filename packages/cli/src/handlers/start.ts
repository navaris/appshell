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
  metadata: boolean;
  config: string;
  manifest: string;
  registry: string;
  adjunctRegistry: string[];
};

export default async (argv: StartArgs): Promise<void> => {
  const {
    env,
    envGlobalName,
    envPrefix,
    outDir,
    remote,
    host,
    metadata,
    manifest,
    config,
    registry,
    adjunctRegistry,
  } = argv;

  // eslint-disable-next-line no-console
  console.log(
    `starting appshell
      --env=${env}
      --env-prefix=${envPrefix}
      --env-global-name=${envGlobalName}
      --out-dir=${outDir}
      --remote=${remote}
      --host=${host}
      --metadata=${metadata}
      --manifest=${manifest}
      --config=${config}
      --registry=${registry}
      --adjunct-registry=${adjunctRegistry}`,
  );

  const prefix = 'appshell';
  const sources = adjunctRegistry.concat(registry).join(' ');

  if (remote) {
    const configPath = path.join(outDir, config);
    const manifestPath = path.join(outDir, manifest);
    const configDirname = path.dirname(configPath);

    if (!fs.existsSync(configDirname)) {
      fs.mkdirSync(configDirname);
      fs.writeFileSync(configPath, '');
    }

    const watchTemplate = exec(
      `npm exec -- nodemon --watch ${configPath} --exec "appshell generate manifest --config ${configPath} && appshell register --manifest ${manifestPath} --registry ${registry}"`,
    );
    watchTemplate.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });
  }

  if (host) {
    const watchEnv = exec(
      `npm exec -- nodemon --watch ${env} --exec "appshell generate env -e ${env} --overwrite --prefix ${envPrefix} --globalName ${envGlobalName}"`,
    );
    watchEnv.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });

    if (!fs.existsSync(registry)) {
      fs.mkdirSync(registry);
    }
    const watchRegistry = exec(
      `npm exec -- nodemon --watch ${registry} --delay 500ms --ext json --exec "appshell generate index --registry ${sources} && appshell generate metadata --registry ${sources}"`,
    );
    watchRegistry.stdout?.on('data', (data) => {
      // eslint-disable-next-line no-console
      console.log(`${prefix}: ${data}`);
    });
  }
};

import { keys, values } from 'lodash';
import path from 'path';
import generate from '../src/generate';
import manifest from './assets/appshell.manifest.json';

type TestMetadata = {
  route: string;
  displayName: string;
  displayGroup: string;
  order: number;
  icon: string;
};

describe('generate', () => {
  const packageName = 'config';
  const appshellConfig = path.resolve(
    `packages/${packageName}/__tests__/assets/appshell.config.yaml`,
  );
  const webpackConfig = path.resolve(`packages/${packageName}/__tests__/assets/webpack.config.js`);

  process.env.APPS_TEST_URL = 'http://remote-module.com/remoteEntry.js';
  process.env.RUNTIME_ENV = 'development';
  process.env.RUNTIME_ENV_VERSION = '1.0.0';

  it('should generate an appshell manifest from the appshell config', async () => {
    const config = await generate(appshellConfig, webpackConfig);

    expect(config).toMatchSnapshot();
  });

  it('should produce null when config is available to process', async () => {
    const config = await generate(undefined as any, webpackConfig);

    expect(config).toBeNull();
  });

  it('should contain all remotes', async () => {
    const config = await generate(appshellConfig, webpackConfig);
    const expectedRemotes = keys(manifest.remotes);
    const actualRemotes = keys(config?.remotes);

    expect(expectedRemotes).toEqual(actualRemotes);
  });

  it('should apply environment variables to configuration', async () => {
    const config = await generate(appshellConfig, webpackConfig);

    const actualUrls = values(config?.remotes).flatMap((remote) => remote.url);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(actualUrls.some((url) => url.includes(process.env.APPS_TEST_URL!))).toBeTruthy();
  });

  it('should capture metadata', async () => {
    const config = await generate<TestMetadata>(appshellConfig, webpackConfig);

    expect(values(config?.remotes).flatMap((remote) => remote.metadata)).toHaveLength(3);
  });
});

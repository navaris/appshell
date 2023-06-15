import { keys, values } from 'lodash';
import path from 'path';
import generate from '../src/generate';
import bar from './assets/appshell_configs/BarModule-Bar.json';
import biz from './assets/appshell_configs/BizModule-Biz.json';
import bing from './assets/appshell_configs/FooModule-Bing.json';
import foo from './assets/appshell_configs/FooModule-Foo.json';

type TestMetadata = {
  route: string;
  displayName: string;
  displayGroup: string;
  order: number;
  icon: string;
};

describe('generate', () => {
  const packageName = 'config';
  const configsDir = path.resolve(`packages/${packageName}/__tests__/assets/appshell_configs`);
  process.env.APPS_TEST_URL = 'http://remote-module.com/remoteEntry.js';

  it('should generate an appshell manifest from a collection of app manifests', () => {
    const config = generate(configsDir, 2);

    expect(config).toMatchSnapshot();
  });

  it('should contain all remotes', () => {
    const config = generate(configsDir, 2);

    const expectedRemotes = [bar, biz, bing, foo].flatMap((item) => keys(item.remotes));
    const actualRemotes = keys(config.remotes);

    expect(expectedRemotes).toEqual(actualRemotes);
  });

  it('should apply environment variables to configuration', () => {
    const config = generate(configsDir, 2);

    const actualUrls = values(config.remotes).flatMap((remote) => remote.url);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(actualUrls.some((url) => url.includes(process.env.APPS_TEST_URL!))).toBeTruthy();
  });

  it('should merge module configurations', () => {
    const config = generate(configsDir, 2);

    const expectedEntrypoints = [bar, biz, bing, foo].flatMap((item) => keys(item.module.exposes));
    const actualEntrypoints = values(config.modules).flatMap((remote) => keys(remote.exposes));

    expect(expectedEntrypoints).toEqual(actualEntrypoints);
  });

  it('should capture metadata', () => {
    const config = generate<TestMetadata>(configsDir);

    expect(values(config.remotes).flatMap((remote) => remote.metadata)).toHaveLength(4);
  });
});

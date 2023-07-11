import { keys, values } from 'lodash';
import path from 'path';
import generateEnv from '../src/generate.env';
import generateIndex from '../src/generate.index';
import generate from '../src/generate.manifest';
import generateMetadata from '../src/generate.metadata';
import * as utils from '../src/utils';
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

  describe('runtime env file', () => {
    const env = `packages/${packageName}/__tests__/assets/test.env`;

    it('should generate the runtime environment js file', async () => {
      const environment = await generateEnv(env);

      expect(Object.fromEntries(environment)).toStrictEqual({
        REGISTRY: 'packages/cli/__tests__/assets/appshell_registry',
        ROOT: 'TestModule/Workspace',
        TEST_ENV_FOO: 'foo',
        TEST_ENV_BAR: 'bar',
      });
    });

    it('should capture only prefixed environment vars when prefix is supplied', async () => {
      const environment = await generateEnv(env, 'TEST_');

      expect(Object.fromEntries(environment)).toStrictEqual({
        TEST_ENV_FOO: 'foo',
        TEST_ENV_BAR: 'bar',
      });
    });

    it('should fail gracefully when env file is not found', async () => {
      await expect(generateEnv('does_not_exist.env')).rejects.toThrow();
    });
  });

  describe('manifest', () => {
    const appshellConfig = path.resolve(
      `packages/${packageName}/__tests__/assets/appshell.config.json`,
    );

    process.env.APPS_TEST_URL = 'http://remote-module.com/remoteEntry.js';
    process.env.RUNTIME_ENV = 'development';
    process.env.RUNTIME_ENV_VERSION = '1.0.0';

    it('should generate an appshell manifest from the appshell config', async () => {
      const config = await generate(appshellConfig);

      expect(config).toMatchSnapshot();
    });

    it('should produce null when config is available to process', async () => {
      const config = await generate(undefined as any);

      expect(config).toBeNull();
    });

    it('should contain all remotes', async () => {
      const config = await generate(appshellConfig);
      const expectedRemotes = keys(manifest.remotes);
      const actualRemotes = keys(config?.remotes);

      expect(expectedRemotes).toEqual(actualRemotes);
    });

    it('should apply environment variables to configuration', async () => {
      const config = await generate(appshellConfig);

      const actualUrls = values(config?.remotes).flatMap((remote) => remote.manifestUrl);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(actualUrls.some((url) => url.includes(process.env.APPS_TEST_URL!))).toBeTruthy();
    });

    it('should capture metadata', async () => {
      const config = await generate<TestMetadata>(appshellConfig);

      expect(values(config?.remotes).flatMap((remote) => remote.metadata)).toHaveLength(3);
    });
  });

  describe('index', () => {
    let consoleSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error');
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    const singleIndex = [`packages/${packageName}/__tests__/assets/registries/appshell.index.json`];
    const adjunctRegistries = [
      `packages/${packageName}/__tests__/assets/registries/registry_a`,
      `packages/${packageName}/__tests__/assets/registries/registry_b`,
    ];

    it('should merge valid registry indexes', async () => {
      const index = await generateIndex([...adjunctRegistries, ...singleIndex]);

      expect(index).toMatchSnapshot();
    });

    it('should handle a single index file', async () => {
      const index = await generateIndex(singleIndex);

      expect(index).toMatchSnapshot();
    });

    it('should handle a directory', async () => {
      const index = await generateIndex(adjunctRegistries);

      expect(index).toMatchSnapshot();
    });

    it('should log error and return empty if something goes wrong', async () => {
      jest.spyOn(utils, 'merge').mockImplementationOnce(() => {
        throw new Error('Something went wrong');
      });
      const index = await generateIndex(singleIndex);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error generating appshell index',
        'Something went wrong',
      );
      expect(index).toMatchObject({});
    });
  });

  describe('metadata', () => {
    let consoleSpy: jest.SpyInstance;
    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error');
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    const singleIndex = [
      `packages/${packageName}/__tests__/assets/registries/appshell.metadata.json`,
    ];
    const adjunctRegistries = [
      `packages/${packageName}/__tests__/assets/registries/registry_a`,
      `packages/${packageName}/__tests__/assets/registries/registry_b`,
    ];

    it('should merge valid registry indexes', async () => {
      const index = await generateMetadata([...adjunctRegistries, ...singleIndex]);

      expect(index).toMatchSnapshot();
    });

    it('should handle a single index file', async () => {
      const index = await generateMetadata(singleIndex);

      expect(index).toMatchSnapshot();
    });

    it('should handle a directory', async () => {
      const index = await generateMetadata(adjunctRegistries);

      expect(index).toMatchSnapshot();
    });

    it('should log error and return empty if something goes wrong', async () => {
      jest.spyOn(utils, 'merge').mockImplementationOnce(() => {
        throw new Error('Something went wrong');
      });
      const index = await generateMetadata(singleIndex);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error generating appshell metadata',
        'Something went wrong',
      );
      expect(index).toMatchObject({});
    });
  });
});

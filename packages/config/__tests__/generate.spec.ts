import { HttpStatusCode } from 'axios';
import https from 'https';
import { keys, values } from 'lodash';
import path from 'path';
import generateEnv from '../src/generate.env';
import generateGlobalConfig from '../src/generate.global-config';
import generate from '../src/generate.manifest';
import * as utils from '../src/utils';
import manifest from './assets/appshell.manifest.json';
import mockAxios from './utils/axios';

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
    const configTemplate = path.resolve(
      `packages/${packageName}/__tests__/assets/appshell.template.json`,
    );

    process.env.APPS_TEST_URL = 'http://remote-module.com/remoteEntry.js';
    process.env.RUNTIME_ENV = 'development';
    process.env.RUNTIME_ENV_VERSION = '1.0.0';

    it('should generate an appshell manifest from the config template', async () => {
      const config = await generate(configTemplate);

      expect(config).toMatchSnapshot();
    });

    it('should produce null when config is available to process', async () => {
      const config = await generate(undefined as any);

      expect(config).toBeNull();
    });

    it('should contain all remotes', async () => {
      const config = await generate(configTemplate);
      const expectedRemotes = keys(manifest.remotes);
      const actualRemotes = keys(config?.remotes);

      expect(expectedRemotes).toEqual(actualRemotes);
    });

    it('should apply environment variables to configuration', async () => {
      const config = await generate(configTemplate);

      const actualUrls = values(config?.remotes).flatMap((remote) => remote.manifestUrl);

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(actualUrls.some((url) => url.includes(process.env.APPS_TEST_URL!))).toBeTruthy();
    });

    it('should capture metadata', async () => {
      const config = await generate<TestMetadata>(configTemplate);

      expect(values(config?.remotes).flatMap((remote) => remote.metadata)).toHaveLength(3);
    });
  });

  describe('register', () => {
    let agentConstructorSpy: jest.SpyInstance;
    let consoleSpy: jest.SpyInstance;
    beforeEach(() => {
      agentConstructorSpy = jest.spyOn(https, 'Agent').mockReturnThis();
      consoleSpy = jest.spyOn(console, 'error');
    });

    afterEach(() => {
      agentConstructorSpy.mockRestore();
      consoleSpy.mockRestore();
    });

    const testGlobalConfig = [
      `packages/${packageName}/__tests__/assets/registries/appshell.config.json`,
    ];
    const adjunctRegistries = [
      `packages/${packageName}/__tests__/assets/registries/registry_a`,
      `packages/${packageName}/__tests__/assets/registries/registry_b`,
    ];
    const remoteRegistries = ['https://test.com/registry'];

    it('should merge multiple valid global configurations', async () => {
      const config = await generateGlobalConfig([...adjunctRegistries, ...testGlobalConfig]);

      expect(config).toMatchSnapshot();
    });

    it('should handle a single global configuration file', async () => {
      const config = await generateGlobalConfig(testGlobalConfig);

      expect(config).toMatchSnapshot();
    });

    it('should handle a directory', async () => {
      const config = await generateGlobalConfig(adjunctRegistries);

      expect(config).toMatchSnapshot();
    });

    it('should log error and return empty if something goes wrong', async () => {
      jest.spyOn(utils, 'merge').mockImplementationOnce(() => {
        throw new Error('Something went wrong');
      });
      const config = await generateGlobalConfig(testGlobalConfig);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error generating global appshell configuration',
        'Something went wrong',
      );
      expect(config).toMatchObject({});
    });

    it('should configure http client when insecure is true', async () => {
      mockAxios
        .onGet(/\/registry/i)
        .reply(HttpStatusCode.Ok, { status: HttpStatusCode.Ok, statusText: 'OK', data: {} });

      await generateGlobalConfig(remoteRegistries, { insecure: true });

      expect(agentConstructorSpy).toHaveBeenCalledWith({ rejectUnauthorized: false });
    });

    it('should not configure http client when insecure is false', async () => {
      mockAxios
        .onGet(/\/registry/i)
        .reply(HttpStatusCode.Ok, { status: HttpStatusCode.Ok, statusText: 'OK', data: {} });

      await generateGlobalConfig(remoteRegistries, { insecure: false });

      expect(agentConstructorSpy).not.toHaveBeenCalled();
    });
  });
});

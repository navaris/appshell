import { entries, values } from 'lodash';
import configmap from '../src/configmap';
import { toAppshellManifest } from '../src/mappers';
import { AppshellConfig, AppshellManifest } from '../src/types';
import config from './assets/appshell.config.json';

describe('mapping configurations to domain objects', () => {
  const APPS_TEST_URL = 'http://remote-endpoint.com';
  const APPS_TEST_REMOTE_ENTRY_PATH = 'remoteEntry.js';
  const RUNTIME_ENV = 'development';
  const RUNTIME_ENV_VERSION = '1.0.0';

  let appshellManifest: AppshellManifest;
  beforeEach(() => {
    process.env.APPS_TEST_URL = APPS_TEST_URL;
    process.env.APPS_TEST_REMOTE_ENTRY_PATH = APPS_TEST_REMOTE_ENTRY_PATH;
    process.env.RUNTIME_ENV = RUNTIME_ENV;
    process.env.RUNTIME_ENV_VERSION = RUNTIME_ENV_VERSION;
    const configMap = configmap.create(config as AppshellConfig);
    appshellManifest = toAppshellManifest(config as AppshellConfig, configMap);
  });

  it('should match snapshot', () => {
    expect(appshellManifest).toMatchSnapshot();
  });

  it('should replace url placeholders with environment variables', () => {
    expect(
      values(appshellManifest.remotes).some((remote) => remote.url.includes(APPS_TEST_URL)),
    ).toBeTruthy();
  });

  it('should create the scope value from the remote key', () => {
    expect(
      entries(appshellManifest.remotes).every(([key, remote]) => key.includes(remote.scope)),
    ).toBeTruthy();
  });

  it('should create the module value from the remote key', () => {
    expect(
      entries(appshellManifest.remotes).every(([key, remote]) => {
        const moduleName = key.replace(/\/.+/, '');
        const moduleKey = key.replace(moduleName, '.');

        return moduleKey === remote.module;
      }),
    ).toBeTruthy();
  });

  it('should map shareScope to manifest remote', () => {
    expect(values(appshellManifest.remotes).every((remote) => remote.shareScope)).toBeTruthy();
  });
});

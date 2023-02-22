import { values } from 'lodash';
import configmap from '../src/configmap';
import { toAppshellManifest } from '../src/mappers';
import { AppshellConfig } from '../src/types';
import config from './assets/appshell.config.json';

describe('mapping configurations to domain objects', () => {
  it('should match snapshot', () => {
    const APPS_TEST_URL = 'http://remote-endpoint.com';
    process.env.APPS_TEST_URL = APPS_TEST_URL;
    const configMap = configmap.create(config as AppshellConfig);
    const appshellConfig = toAppshellManifest(config as AppshellConfig, configMap);

    expect(appshellConfig).toMatchSnapshot();
  });

  it('should replace url placeholders with environment variables', () => {
    const APPS_TEST_URL = 'http://remote-endpoint.com';
    process.env.APPS_TEST_URL = APPS_TEST_URL;
    const configMap = configmap.create(config as AppshellConfig);
    const appshellConfig = toAppshellManifest(config as AppshellConfig, configMap);

    expect(
      values(appshellConfig.remotes).some((remote) => remote.url.includes(APPS_TEST_URL)),
    ).toBeTruthy();
  });
});

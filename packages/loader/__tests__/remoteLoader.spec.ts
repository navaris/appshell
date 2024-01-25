/** @jest-environment jsdom */
import { AppshellManifest } from '@appshell/config';
import { AppshellGlobalConfig } from '@appshell/config/src/types';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import * as fetchDynamicScript from '../src/fetchDynamicScript';
import * as loadAppshellComponent from '../src/loadAppshellComponent';
import remoteLoader from '../src/remoteLoader';

enableFetchMocks();

jest.mock('../src/fetchDynamicScript');
jest.mock('../src/loadAppshellComponent');

describe('remoteLoader', () => {
  const manifest: AppshellManifest = {
    remotes: {
      'TestModule/TestComponent': {
        id: 'test-component',
        scope: 'TestModule',
        module: './TestComponent',
        manifestUrl: 'http://test.com/appshell.manifest.json',
        remoteEntryUrl: 'http://test.com/remoteEntry.js',
        metadata: {},
      },
    },
    modules: {},
    environment: {
      TestModule: {
        ENV_VAR_A: 'Original value for A',
      },
    },
  };
  const config: AppshellGlobalConfig = {
    index: {
      'TestModule/TestComponent': 'http://test.com/appshell.manifest.json',
    },
    metadata: {},
    overrides: {
      environment: {
        TestModule: {
          ENV_VAR_A: 'New value for A',
        },
      },
    },
  };

  beforeEach(() => {
    fetch.mockIf('http://test.com/appshell.manifest.json', () =>
      Promise.resolve({ ok: true, body: JSON.stringify(manifest) }),
    );
  });

  it('should return the Appshell component if it is found in the registry', async () => {
    const ExpectedComponent = () => 'test component';
    jest.spyOn(fetchDynamicScript, 'default').mockReturnValueOnce(Promise.resolve(true));
    jest
      .spyOn(loadAppshellComponent, 'default')
      .mockResolvedValue(Promise.resolve(ExpectedComponent));

    const loadRemote = remoteLoader(config);
    const [ActualComponent, actualManifest] = await loadRemote('TestModule/TestComponent');

    expect(ActualComponent).toEqual(ExpectedComponent);
    expect(actualManifest).toEqual(manifest);
  });

  it('should not fetch remote entry more than once', async () => {
    const ExpectedComponent = () => 'test component';
    const fetchDynamicScriptSpy = jest
      .spyOn(fetchDynamicScript, 'default')
      .mockReturnValueOnce(Promise.resolve(true));
    jest
      .spyOn(loadAppshellComponent, 'default')
      .mockResolvedValue(Promise.resolve(ExpectedComponent));

    const loadRemote = remoteLoader(config);

    await loadRemote('TestModule/TestComponent');
    await loadRemote('TestModule/TestComponent');
    await loadRemote('TestModule/TestComponent');

    expect(fetchDynamicScriptSpy).toHaveBeenCalledTimes(1);
  });

  it('should apply overridden environment values', async () => {
    const ExpectedComponent = () => 'test component';
    jest.spyOn(fetchDynamicScript, 'default').mockReturnValueOnce(Promise.resolve(true));
    jest
      .spyOn(loadAppshellComponent, 'default')
      .mockResolvedValue(Promise.resolve(ExpectedComponent));

    const loadRemote = remoteLoader(config);

    await loadRemote('TestModule/TestComponent');

    // eslint-disable-next-line no-underscore-dangle
    expect(window.__appshell_env__TestModule).toMatchObject({ ENV_VAR_A: 'New value for A' });
  });

  it('should throw if remote key is not found in the registry', async () => {
    const ExpectedComponent = () => 'test component';
    jest.spyOn(loadAppshellComponent, 'default').mockResolvedValue(ExpectedComponent);

    const loadRemote = remoteLoader(config);

    await expect(loadRemote('TestModule/DoesNotExist')).rejects.toThrow(
      /Remote resource not found in registry/i,
    );
  });

  it('should throw if load Appshell component fails', async () => {
    jest.spyOn(fetchDynamicScript, 'default').mockReturnValueOnce(Promise.resolve(true));
    jest.spyOn(loadAppshellComponent, 'default').mockRejectedValue(new Error('failed'));

    const loadRemote = remoteLoader(config);

    await expect(loadRemote('TestModule/TestComponent')).rejects.toThrow(
      /Failed to load component/i,
    );
  });
});

/** @jest-environment jsdom */
import { AppshellManifest } from '@appshell/config';
import { AppshellRegister } from '@appshell/config/src/types';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import * as fetchDynamicScript from '../src/fetchDynamicScript';
import * as loadFederatedComponent from '../src/loadFederatedComponent';
import remoteLoader from '../src/remoteLoader';

enableFetchMocks();

jest.mock('../src/fetchDynamicScript');
jest.mock('../src/loadFederatedComponent');

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
    environment: {},
  };
  const register: AppshellRegister = {
    index: {
      'TestModule/TestComponent': 'http://test.com/appshell.manifest.json',
    },
    metadata: {},
  };

  beforeEach(() => {
    fetch.mockIf('http://test.com/appshell.manifest.json', () =>
      Promise.resolve({ ok: true, body: JSON.stringify(manifest) }),
    );
  });

  it('should return the federated component if it is found in the registry', async () => {
    const ExpectedComponent = () => 'test component';
    jest.spyOn(fetchDynamicScript, 'default').mockReturnValueOnce(Promise.resolve(true));
    jest
      .spyOn(loadFederatedComponent, 'default')
      .mockResolvedValue(Promise.resolve(ExpectedComponent));

    const loadRemote = remoteLoader(register);
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
      .spyOn(loadFederatedComponent, 'default')
      .mockResolvedValue(Promise.resolve(ExpectedComponent));

    const loadRemote = remoteLoader(register);

    await loadRemote('TestModule/TestComponent');
    await loadRemote('TestModule/TestComponent');
    await loadRemote('TestModule/TestComponent');

    expect(fetchDynamicScriptSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw if remote key is not found in the registry', async () => {
    const ExpectedComponent = () => 'test component';
    jest.spyOn(loadFederatedComponent, 'default').mockResolvedValue(ExpectedComponent);

    const loadRemote = remoteLoader(register);

    await expect(loadRemote('TestModule/DoesNotExist')).rejects.toThrow(
      /Remote resource not found in registry/i,
    );
  });

  it('should throw if load federated component fails', async () => {
    jest.spyOn(fetchDynamicScript, 'default').mockReturnValueOnce(Promise.resolve(true));
    jest.spyOn(loadFederatedComponent, 'default').mockRejectedValue(new Error('failed'));

    const loadRemote = remoteLoader(register);

    await expect(loadRemote('TestModule/TestComponent')).rejects.toThrow(
      /Failed to load component/i,
    );
  });
});

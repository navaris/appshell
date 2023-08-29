import * as config from '@appshell/config';
import fs from 'fs';
import registerManifestHandler from '../src/handlers/register';

describe('register.manifest', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should check that each manifest exists', async () => {
    // eslint-disable-next-line no-console
    console.log('todo: figure out why this test fails without this console statement');
    const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync').mockImplementation(() => '""');
    const registerSpy = jest.spyOn(config, 'register').mockImplementation(() => Promise.resolve());
    const registry = 'path/to/registry';
    const manifests = [
      'assets/appshell1.manifest.json',
      'assets/appshell2.manifest.json',
      'assets/appshell3.manifest.json',
    ];

    await registerManifestHandler({ manifest: manifests, registry, allowOverride: false });

    manifests.forEach((manifest) => {
      expect(existsSyncSpy).toHaveBeenCalledWith(manifest);
      expect(readFileSyncSpy).toHaveBeenCalledWith(manifest, expect.anything());
    });
    expect(registerSpy).toHaveBeenCalledTimes(manifests.length);
  });

  it('should reject when manifest does not exist', async () => {
    const registerSpy = jest.spyOn(config, 'register').mockImplementation(() => Promise.resolve());
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const registry = 'path/to/registry';
    const manifests = [
      'assets/appshell1.manifest.json',
      'assets/appshell2.manifest.json',
      'assets/appshell3.manifest.json',
    ];
    await registerManifestHandler({ manifest: manifests, registry, allowOverride: false });

    expect(registerSpy).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Error registering manifest', expect.anything());
  });
});

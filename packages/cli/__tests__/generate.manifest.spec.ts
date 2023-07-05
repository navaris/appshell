import * as configModule from '@appshell/config';
import * as fs from 'fs';
import generateManifestHandler from '../src/handlers/generate.manifest';

jest.mock('@appshell/config');
jest.mock('fs');

const generateSpy = jest
  .spyOn(configModule, 'generateManifest')
  .mockResolvedValue({ remotes: {}, modules: {}, environment: {} });
const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

describe('generate.manifest', () => {
  const config = 'assets/appshell.config.yaml';
  const webpack = 'webpack.config.js';
  const env = [];
  const outDir = 'assets/';
  const outFile = 'appshell.manifest.json';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process config', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementation((file) => file === config);
    await generateManifestHandler({
      config,
      webpack,
      env,
      outDir,
      outFile,
    });

    expect(generateSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('should create outDir if it does not exist', async () => {
    const existsSyncSpy = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((file) => file === config);
    const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
    await generateManifestHandler({
      config,
      webpack,
      env,
      outDir,
      outFile,
    });

    expect(existsSyncSpy).toHaveBeenCalled();
    expect(mkdirSyncSpy).toHaveBeenCalled();
  });

  it('should notify if config does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());

    await generateManifestHandler({
      config,
      webpack,
      env,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenLastCalledWith(
      `config not found '${config}'. skipping manifest generation.`,
    );
  });

  it('should notify if config is not provided', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());

    await generateManifestHandler({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      config: undefined as any,
      webpack,
      env,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenLastCalledWith(
      `config not found 'undefined'. skipping manifest generation.`,
    );
  });

  it('should handle gracefully any errors', async () => {
    jest.spyOn(fs, 'existsSync').mockImplementation((file) => file === config);
    jest.spyOn(fs, 'mkdirSync');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    generateSpy.mockImplementationOnce(() => {
      throw new Error('test error');
    });

    await generateManifestHandler({
      config,
      webpack,
      env,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error generating manifest', 'test error');
  });
});

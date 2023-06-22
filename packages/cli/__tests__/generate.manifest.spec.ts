import * as config from '@appshell/config';
import * as fs from 'fs';
import generateManifestHandler from '../src/handlers/generate.manifest';

jest.mock('@appshell/config');
jest.mock('fs');

const generateSpy = jest.spyOn(config, 'generate').mockReturnValue({ remotes: {}, modules: {} });
const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

describe('generate.manifest', () => {
  const configsDir = 'assets/appshell_configs';
  const depth = 1;
  const outDir = 'assets/';
  const outFile = 'appshell.manifest.json';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process configsDir', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation((dir) => dir === configsDir);
    generateManifestHandler({
      configsDir,
      depth,
      outDir,
      outFile,
    });

    expect(generateSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalled();
  });

  it('should create outDir if it does not exist', () => {
    const existsSyncSpy = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation((dir) => dir === configsDir);
    const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
    generateManifestHandler({
      configsDir,
      depth,
      outDir,
      outFile,
    });

    expect(existsSyncSpy).toHaveBeenCalled();
    expect(mkdirSyncSpy).toHaveBeenCalled();
  });

  it('should notify if configsDir does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());

    generateManifestHandler({
      configsDir,
      depth,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenLastCalledWith(
      `configsDir not found '${configsDir}'. skipping manifest generation.`,
    );
  });

  it('should notify if configsDir is not provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());

    generateManifestHandler({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      configsDir: undefined as any,
      depth,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenLastCalledWith(
      `configsDir not found 'undefined'. skipping manifest generation.`,
    );
  });

  it('should handle gracefully any errors', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation((dir) => dir === configsDir);
    jest.spyOn(fs, 'mkdirSync');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    generateSpy.mockImplementationOnce(() => {
      throw new Error('test error');
    });

    generateManifestHandler({
      configsDir,
      depth,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error generating manifest', 'test error');
  });
});

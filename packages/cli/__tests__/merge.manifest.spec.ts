import * as config from '@appshell/config';
import * as fs from 'fs';
import mergeManifestHandler from '../src/handlers/merge.manifest';
import mockAxios from './utils/axios';

jest.mock('@appshell/config');
jest.mock('fs');

describe('merge.manifest', () => {
  const outDir = 'assets/';
  const outFile = 'appshell.manifest.json';

  let mergeSpy: jest.SpyInstance;
  let writeFileSyncSpy: jest.SpyInstance;
  beforeEach(() => {
    mergeSpy = jest.spyOn(config.utils, 'merge').mockReturnValue('');
    writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  it('asdf should merge manifests', async () => {
    const manifest = ['assets/test_a.manifest.json', 'assets/test_b.manifest.json'];
    mergeSpy.mockReturnValueOnce({ remotes: {}, modules: {} });
    jest.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => false } as any);
    jest.spyOn(fs, 'existsSync').mockImplementation((dir) => manifest.includes(dir.toString()));
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => '""');
    await mergeManifestHandler({
      manifest,
      outDir,
      outFile,
    });

    expect(mergeSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      'assets/appshell.manifest.json',
      expect.anything(),
    );
  });

  it('should merge manifests from directory', async () => {
    const manifests = [
      'assets/test_a.manifest.json',
      'assets/test_b.manifest.json',
      'assets/appshell_manifests/',
    ];
    const expectedManifests = [
      'assets/test_a.manifest.json',
      'assets/test_b.manifest.json',
      'assets/appshell_manifests/test_a.manifest.json',
      'assets/appshell_manifests/test_b.manifest.json',
      'assets/appshell_manifests/test_c.manifest.json',
    ];
    jest
      .spyOn(fs, 'statSync')
      .mockImplementation((dir) =>
        dir === 'assets/appshell_manifests/'
          ? { isDirectory: () => true }
          : ({ isDirectory: () => false } as any),
      );
    mergeSpy.mockReturnValueOnce({ remotes: {}, modules: {} });
    const listSpy = jest.spyOn(config.utils, 'list').mockReturnValue(expectedManifests);
    jest.spyOn(fs, 'readdirSync').mockImplementation(() => expectedManifests as any);
    jest.spyOn(fs, 'existsSync').mockImplementation((dir) => manifests.includes(dir.toString()));
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => '""');
    await mergeManifestHandler({
      manifest: manifests,
      outDir,
      outFile,
    });

    expect(mergeSpy).toHaveBeenCalled();
    expect(listSpy).toHaveBeenCalledWith('assets/appshell_manifests/', 1, /\.json$/i);
    expect(writeFileSyncSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      'assets/appshell.manifest.json',
      expect.anything(),
    );
  });

  it('should merge manifests when some are urls', async () => {
    mockAxios.onGet(/\/appshell.manifest.json/i).reply(200, '');
    const manifest = [
      'http://localhost:3030/appshell.manifest.json',
      'assets/test_b.manifest.json',
    ];
    mergeSpy.mockReturnValueOnce({ remotes: {}, modules: {} });
    jest.spyOn(fs, 'existsSync').mockImplementation((dir) => manifest.includes(dir.toString()));
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => '""');
    await mergeManifestHandler({
      manifest,
      outDir,
      outFile,
    });

    expect(mergeSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalled();
    expect(writeFileSyncSpy).toHaveBeenCalledWith(
      'assets/appshell.manifest.json',
      expect.anything(),
    );
  });

  it('should handle gracefully any errors', async () => {
    const manifest = ['assets/test_a.manifest.json', 'assets/test_b.manifest.json'];
    mergeSpy.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    jest.spyOn(fs, 'existsSync').mockImplementation((dir) => manifest.includes(dir.toString()));
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => '""');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    await mergeManifestHandler({
      manifest,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error merging manifests', 'test error');
  });

  it('should noop when no manifests are found', async () => {
    const manifest = [] as string[];
    mergeSpy.mockReturnValueOnce({ remotes: {}, modules: {} });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(fs, 'existsSync').mockImplementation((dir) => manifest.includes(dir.toString()));
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => '""');
    await mergeManifestHandler({
      manifest,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenCalledWith(`No manifests found. skipping manifest merge.`);
    expect(mergeSpy).not.toHaveBeenCalled();
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });
});

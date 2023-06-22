import * as config from '@appshell/config';
import * as fs from 'fs';
import mergeManifestHandler from '../src/handlers/merge.manifest';
import mockAxios from './utils/axios';

jest.mock('@appshell/config');
jest.mock('fs');

const mergeSpy = jest.spyOn(config.utils, 'merge').mockReturnValue('');
const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');

describe('merge.manifest', () => {
  const outDir = 'assets/';
  const outFile = 'appshell.manifest.json';
  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  it('should merge manifests', async () => {
    const manifest = ['assets/test_a.manifest.json', 'assets/test_b.manifest.json'];
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

  it('should noop when a single manifest is found', async () => {
    const manifest = ['appshell.manifest.json'] as string[];
    mergeSpy.mockReturnValueOnce({ remotes: {}, modules: {} });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.spyOn(fs, 'existsSync').mockImplementation((dir) => manifest.includes(dir.toString()));
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => '""');
    await mergeManifestHandler({
      manifest,
      outDir,
      outFile,
    });

    expect(consoleSpy).toHaveBeenCalledWith(`Only one manifest found. skipping manifest merge.`);
    expect(mergeSpy).not.toHaveBeenCalled();
    expect(writeFileSyncSpy).not.toHaveBeenCalled();
  });
});

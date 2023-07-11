import fs from 'fs';
import path from 'path';
import { AppshellManifest } from '../src/types';
import { merge } from '../src/utils';
import copy from '../src/utils/copy';
import load from '../src/utils/load';
import validator from '../src/validators/appshell.manifest';
import mergeValidator from '../src/validators/merge.manifests';
import manifestA from './assets/appshell_manifests/test_a.manifest.json';
import manifestB from './assets/appshell_manifests/test_b.manifest.json';
import manifestC from './assets/appshell_manifests/test_c.manifest.json';
import manifestD from './assets/appshell_manifests/test_d.manifest.json';
import bizManifest from './assets/appshell_utils/bizmodule-biz.json';
import environmentCollisions from './assets/appshell_utils/environment-collisions.json';
import remoteCollisions from './assets/appshell_utils/remote-collisions.json';
import barManifest from './assets/appshell_utils/testmodule-bar.json';
import fooManifest from './assets/appshell_utils/testmodule-foo.json';

describe('utils', () => {
  const packageName = 'config';

  describe('load', () => {
    describe('consuming the configuration', () => {
      test('should read and parse the configuration file', () => {
        const file = path.resolve(`packages/${packageName}/__tests__/assets/appshell.config.yaml`);
        const config = load(file);

        expect(config).toMatchSnapshot();
      });

      test('should reject configuration file cannot be found', () => {
        const file = path.resolve(
          `packages/${packageName}/__tests__/assets/does_not_exist.config.yaml`,
        );

        expect(() => load(file)).toThrow(/Config file does not exist/);
      });
    });
  });

  describe('load', () => {
    describe('consuming the configuration', () => {
      test('should read and parse the configuration file', () => {
        const file = path.resolve(`packages/${packageName}/__tests__/assets/appshell.config.yaml`);
        const config = load(file);

        expect(config).toMatchSnapshot();
      });

      test('should reject configuration file cannot be found', () => {
        const file = path.resolve(
          `packages/${packageName}/__tests__/assets/does_not_exist.config.yaml`,
        );

        expect(() => load(file)).toThrow(/Config file does not exist/);
      });
    });
  });

  describe('copy', () => {
    const pattern = { from: '/path/to/file.json', to: '/new/path/to/file.json' };

    beforeAll(() => {
      jest.mock('fs');
    });

    afterAll(() => {
      jest.unmock('fs');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('should not copy if source file does not exist', () => {
      const existsSyncSpy = jest.spyOn(fs, 'existsSync').mockReturnValueOnce(false);
      const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');
      const copyFileSyncSpy = jest.spyOn(fs, 'copyFileSync');

      copy(pattern);

      expect(existsSyncSpy).toHaveBeenCalled();
      expect(mkdirSyncSpy).not.toHaveBeenCalled();
      expect(copyFileSyncSpy).not.toHaveBeenCalled();
    });

    test('should create the destination directory if it does not exist', () => {
      const toDir = path.dirname(pattern.to);
      const existsSyncSpy = jest
        .spyOn(fs, 'existsSync')
        .mockImplementation((file) => file === pattern.from);
      const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementationOnce(jest.fn());
      const copyFileSyncSpy = jest.spyOn(fs, 'copyFileSync').mockImplementation(jest.fn());

      copy(pattern);

      expect(existsSyncSpy).toHaveBeenCalledWith(pattern.from);
      expect(existsSyncSpy).toHaveBeenCalledWith(toDir);
      expect(mkdirSyncSpy).toHaveBeenCalledWith(toDir);
      expect(copyFileSyncSpy).toHaveBeenCalledWith(pattern.from, pattern.to);
    });

    test('should copy if source file exists', () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      const copyFileSyncSpy = jest.spyOn(fs, 'copyFileSync').mockImplementation(jest.fn());

      copy(pattern);

      expect(copyFileSyncSpy).toHaveBeenCalledWith(pattern.from, pattern.to);
    });
  });

  describe('merge', () => {
    test('should merge multiple valid configurations', () => {
      const config = merge<AppshellManifest>(validator, fooManifest, barManifest, bizManifest);
      expect(config).toMatchSnapshot();
    });

    test('should merge manifests from right to left with merge validator', () => {
      const config = merge<AppshellManifest>(
        mergeValidator,
        manifestA,
        manifestB,
        manifestC,
        manifestD,
      );

      expect(config).toMatchSnapshot();
    });

    test('should reject when no validator is found for schema', () => {
      expect(() =>
        merge<AppshellManifest>(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          undefined as any,
          fooManifest,
          barManifest,
          bizManifest,
        ),
      ).toThrow(/No validator provided/);
    });

    test('should validate add documents individually', () => {
      const validateSpy = jest.spyOn(validator, 'validate');
      merge<AppshellManifest>(validator, fooManifest, barManifest, bizManifest);

      expect(validateSpy).toHaveBeenCalledWith(fooManifest);
      expect(validateSpy).toHaveBeenCalledWith(barManifest);
      expect(validateSpy).toHaveBeenCalledWith(bizManifest);
    });

    test('should validate merged document', () => {
      const validateSpy = jest.spyOn(validator, 'validate');
      const config = merge<AppshellManifest>(validator, fooManifest, barManifest, bizManifest);

      expect(validateSpy).toHaveBeenLastCalledWith(config);
    });

    describe('appshell configs', () => {
      test('should merge multiple valid configurations', () => {
        const config = merge<AppshellManifest>(validator, fooManifest, barManifest, bizManifest);

        expect(config).toMatchSnapshot();
      });

      test('should reject configurations with remotes collisions', () => {
        expect(() =>
          merge<AppshellManifest>(validator, fooManifest, barManifest, remoteCollisions),
        ).toThrow('Multiple remotes with the same key');
      });

      test('should reject configurations with environment collisions', () => {
        expect(() =>
          merge<AppshellManifest>(validator, fooManifest, barManifest, environmentCollisions),
        ).toThrow('Multiple environments with the same key');
      });
    });
  });
});

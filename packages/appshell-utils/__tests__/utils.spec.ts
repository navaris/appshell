import fs from 'fs';
import path from 'path';
import { AppshellManifest } from '../src/types';
import { merge } from '../src/utils';
import copy from '../src/utils/copy';
import load from '../src/utils/load';
import validator from '../src/validators/appshell.manifest';
import biz from './assets/appshell_utils/bizmodule-biz.json';
import remoteCollisions from './assets/appshell_utils/remote-collisions.json';
import bar from './assets/appshell_utils/testmodule-bar.json';
import foo from './assets/appshell_utils/testmodule-foo.json';

describe('utils', () => {
  const packageName = 'appshell-utils';

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
      const config = merge<AppshellManifest>(validator, foo, bar, biz);
      expect(config).toMatchSnapshot();
    });

    test('should reject when no validator is found for schema', () => {
      expect(() =>
        merge<AppshellManifest>(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          undefined as any,
          foo,
          bar,
          biz,
        ),
      ).toThrow(/No validator provided/);
    });

    test('should validate add documents individually', () => {
      const validateSpy = jest.spyOn(validator, 'validate');
      merge<AppshellManifest>(validator, foo, bar, biz);

      expect(validateSpy).toHaveBeenCalledWith(foo);
      expect(validateSpy).toHaveBeenCalledWith(bar);
      expect(validateSpy).toHaveBeenCalledWith(biz);
    });

    test('should validate merged document', () => {
      const validateSpy = jest.spyOn(validator, 'validate');
      const config = merge<AppshellManifest>(validator, foo, bar, biz);

      expect(validateSpy).toHaveBeenLastCalledWith(config);
    });

    describe('appshell configs', () => {
      test('should merge multiple valid configurations', () => {
        const config = merge<AppshellManifest>(validator, foo, bar, biz);

        expect(config).toMatchSnapshot();
      });

      test('should reject configurations with remotes collisions', () => {
        expect(() => merge<AppshellManifest>(validator, foo, bar, remoteCollisions)).toThrow(
          'Multiple remotes with the same key',
        );
      });
    });
  });
});

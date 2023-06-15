import appshellConfigValidator from '../src/validators/appshell.config';
import appshellManifestValidator from '../src/validators/appshell.manifest';
import appshellConfigRemoteCollisions from './assets/appshell.config-remote-collision.json';
import validManifest from './assets/appshell.json';
import appshellManifestRemoteCollisions from './assets/appshell.manifest-remote-collision.json';
import validAppshellConfig from './assets/appshell_configs/BarModule-Bar.json';
import bizAppshellConfig from './assets/appshell_configs/BizModule-Biz.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyConfig = any;

describe('validators', () => {
  describe('appshell.config validator', () => {
    it('should pass a valid appshell config', () => {
      expect(() => appshellConfigValidator.validate(validAppshellConfig)).not.toThrow();
    });

    it('should throw if multiple remotes with the same ID', () => {
      expect(() =>
        appshellConfigValidator.validate<AnyConfig>(bizAppshellConfig, bizAppshellConfig),
      ).toThrow(/multiple remotes with the same ID/i);
    });

    it('should throw if multiple remotes with the same key', () => {
      expect(() =>
        appshellConfigValidator.validate<AnyConfig>(
          bizAppshellConfig,
          appshellConfigRemoteCollisions,
        ),
      ).toThrow(/multiple remotes with the same key/i);
    });
  });

  describe('appshell.manifest validator', () => {
    it('should pass a valid appshell manifest', () => {
      expect(() => appshellManifestValidator.validate(validManifest)).not.toThrow();
    });

    it('should throw if multiple remotes with the same ID', () => {
      expect(() =>
        appshellManifestValidator.validate<AnyConfig>(validManifest, validManifest),
      ).toThrow(/multiple remotes with the same ID/i);
    });

    it('should throw if multiple remotes with the same key', () => {
      expect(() =>
        appshellManifestValidator.validate<AnyConfig>(
          validManifest,
          appshellManifestRemoteCollisions,
        ),
      ).toThrow(/multiple remotes with the same key/i);
    });
  });
});

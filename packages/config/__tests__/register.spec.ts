import fs from 'fs';
import path from 'path';
import register from '../src/register';
import { AppshellManifest } from '../src/types';

describe('register', () => {
  const packageName = 'config';
  const registryDir = path.resolve(`packages/${packageName}/__tests__/assets/appshell_registry`);
  const manifestAPath = path.resolve(
    `packages/${packageName}/__tests__/assets/appshell_manifests/test_a.manifest.json`,
  );
  const manifestBPath = path.resolve(
    `packages/${packageName}/__tests__/assets/appshell_manifests/test_b.manifest.json`,
  );
  const manifestCPath = path.resolve(
    `packages/${packageName}/__tests__/assets/appshell_manifests/test_c.manifest.json`,
  );

  afterEach(() => {
    if (fs.existsSync(registryDir)) {
      fs.rmSync(registryDir, { recursive: true });
    }
  });

  it('should register a manifest to directory based registry', () => {
    [manifestAPath, manifestBPath, manifestCPath].forEach((manifestPath) => {
      const file = fs.readFileSync(manifestPath, 'utf-8');
      const manifest = JSON.parse(file) as AppshellManifest;

      register(manifest, registryDir);
    });

    const registry = fs.readdirSync(registryDir);

    expect(registry).toContain('appshell.manifest.json');
    expect(registry).toContain('appshell.register.json');
  });
});

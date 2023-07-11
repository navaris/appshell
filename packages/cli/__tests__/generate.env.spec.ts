import fs from 'fs';
import path from 'path';
import { rimrafSync } from 'rimraf';
import generateEnvHandler from '../src/handlers/generate.env';

describe('generate.env', () => {
  const prefix = '';
  const env = 'packages/cli/__tests__/assets/test.env';
  const outDir = path.resolve('packages/cli/__tests__/assets/temp');
  const outFile = 'runtime.env.js';
  const globalName = 'appshell_env';
  const overwrite = true;

  afterEach(() => {
    rimrafSync(outDir);
  });

  it('should generate the runtime environment js file', async () => {
    await generateEnvHandler({
      env,
      prefix,
      outDir,
      outFile,
      globalName,
      overwrite,
    });
    const actual = fs.readFileSync(path.join(outDir, outFile));

    expect(actual.toString()).toMatchSnapshot();
  });

  it('should capture only prefixed environment vars when prefix is supplied', async () => {
    await generateEnvHandler({
      env,
      prefix: 'TEST_',
      outDir,
      outFile,
      globalName,
      overwrite,
    });
    const actual = fs.readFileSync(path.join(outDir, outFile));

    expect(actual.toString()).toMatchSnapshot();
  });

  it('should output to outDir when supplied', async () => {
    const testPath = path.resolve('packages/cli/__tests__/assets/temp/test');
    await generateEnvHandler({
      env,
      prefix,
      outDir: testPath,
      outFile,
      globalName,
      overwrite,
    });
    const actual = fs.readFileSync(path.join(testPath, outFile));

    expect(actual.toString()).toBeTruthy();
  });

  it('should output with outFile name when supplied', async () => {
    const filename = 'test.env.js';
    await generateEnvHandler({
      env,
      prefix,
      outDir,
      outFile: filename,
      globalName,
      overwrite,
    });
    const actual = fs.readFileSync(path.join(outDir, filename));

    expect(actual.toString()).toBeTruthy();
  });

  it('should output with global variable name supplied', async () => {
    const testGlobalName = 'my_global_var';
    await generateEnvHandler({
      env,
      prefix,
      outDir,
      outFile,
      globalName: testGlobalName,
      overwrite,
    });
    const actual = fs.readFileSync(path.join(outDir, outFile));

    expect(actual.includes(`window.${testGlobalName}`)).toBe(true);
  });

  it('should reject when .env file does not exist', async () => {
    await expect(
      generateEnvHandler({
        env: 'assets/does_not_exist.env',
        prefix,
        outDir,
        outFile: 'runtime.env.js',
        globalName,
        overwrite,
      }),
    ).rejects.toThrow();
  });
});

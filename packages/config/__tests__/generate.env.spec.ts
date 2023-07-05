import generateEnv from '../src/generate.env';

describe('generate.runtime', () => {
  const env = 'packages/config/__tests__/assets/test.env';

  it('should generate the runtime environment js file', async () => {
    const environment = await generateEnv(env);

    expect(Object.fromEntries(environment)).toStrictEqual({
      APPSHELL_REGISTRY: 'packages/cli/__tests__/assets/appshell_registry',
      APPSHELL_ROOT: 'TestModule/Workspace',
      TEST_ENV_FOO: 'foo',
      TEST_ENV_BAR: 'bar',
    });
  });

  it('should capture only prefixed environment vars when prefix is supplied', async () => {
    const environment = await generateEnv(env, 'APPSHELL_');

    expect(Object.fromEntries(environment)).toStrictEqual({
      APPSHELL_REGISTRY: 'packages/cli/__tests__/assets/appshell_registry',
      APPSHELL_ROOT: 'TestModule/Workspace',
    });
  });

  it('should fail gracefully when env file is not found', async () => {
    await expect(generateEnv('does_not_exist.env')).rejects.toThrow();
  });
});

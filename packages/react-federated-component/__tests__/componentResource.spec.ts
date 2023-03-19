/** @jest-environment jsdom */
import * as loader from '@appshell/loader';
import componentResource from '../src/resources/componentResource';
import manifest from './fixtures/Manifest';
import TestComponent from './fixtures/TestComponent';
import waitForResource from './utils/waitForResource';

jest.mock('@appshell/loader');

describe('componentResource', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const returnComponent = async <ComponentType>(_key: string) => TestComponent as ComponentType;
  const throwError = async () => {
    throw new Error('Failed to load federated component');
  };

  it('should return a component when federated component can be loaded', async () => {
    jest.spyOn(loader, 'default').mockReturnValue(returnComponent);

    const resource = componentResource('TestModule/TestComponent', manifest);
    const Component = await waitForResource(resource);

    expect(Component).toEqual(TestComponent);
  });

  it('should throw when federated component cannot be loaded', async () => {
    jest.spyOn(loader, 'default').mockReturnValue(throwError);

    const resource = componentResource('TestModule/TestComponent', manifest);

    await expect(waitForResource(resource)).rejects.toThrow(
      /Error: Failed to load federated component/i,
    );
  });
});

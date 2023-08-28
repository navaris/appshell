import * as config from '@appshell/config';
import deregisterHandler from '../src/handlers/deregister';

describe('deregister command', () => {
  let deregisterSpy: jest.SpyInstance;
  beforeEach(() => {
    deregisterSpy = jest.spyOn(config, 'deregister').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should deregister entry', async () => {
    await deregisterHandler({
      key: ['PingModule/Ping', 'PongModule/Pong'],
      registry: 'my-registry',
    });

    expect(deregisterSpy).toHaveBeenCalledWith('PingModule/Ping', 'my-registry');
    expect(deregisterSpy).toHaveBeenCalledWith('PongModule/Pong', 'my-registry');
  });

  it('should handle a no-op', async () => {
    await deregisterHandler({
      key: [],
      registry: 'my-registry',
    });

    expect(deregisterSpy).not.toHaveBeenCalled();
  });

  it('should log errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    deregisterSpy.mockImplementationOnce(() => {
      throw new Error('Something went wrong');
    });

    await deregisterHandler({
      key: ['PingModule/Ping', 'PongModule/Pong'],
      registry: 'my-registry',
    });

    expect(consoleSpy).toHaveBeenCalledWith('Error deregistering manifest', 'Something went wrong');
  });
});

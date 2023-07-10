import { Resource } from '../../src/types';

const waitForResource = async <TResource>(
  resource: Resource<TResource>,
): Promise<TResource | Error | undefined> => {
  try {
    return resource.read();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (suspender: any) {
    await suspender;
    return resource.read();
  }
};

export default waitForResource;

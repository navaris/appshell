/** @jest-environment jsdom */
import { fireEvent } from '@testing-library/react';
import fetchDynamicScript from '../src/fetchDynamicScript';

const mockHead = (event: string) => {
  const appendChildSpy = jest.spyOn(document.head, 'appendChild').mockImplementation((element) => {
    fireEvent(element, new Event(event));
    return element;
  });
  const removeChildSpy = jest.spyOn(document.head, 'removeChild').mockReturnThis();
  const containsSpy = jest.spyOn(document.head, 'contains').mockReturnValue(true);

  return [appendChildSpy, removeChildSpy, containsSpy];
};

describe('fetchDynamicScript', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should successfully resolve when valid script url is provided', async () => {
    mockHead('load');
    const url = 'http://test.com/1/somescript.js';
    const success = await fetchDynamicScript(url);

    expect(success).toBe(true);
  });

  it('should reject when fetching the script results in an error', async () => {
    mockHead('error');
    const url = 'http://test.com/2/somescript.js';

    await expect(fetchDynamicScript(url)).rejects.toMatch(/Failed to fetch remote entry/i);
  });

  it('should cleanup script tags when finished', async () => {
    const [appendChildSpy, removeChildSpy] = mockHead('load');
    const url = 'http://test.com/3/somescript.js';
    await fetchDynamicScript(url);

    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});

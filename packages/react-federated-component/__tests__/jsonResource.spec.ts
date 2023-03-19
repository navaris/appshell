/** @jest-environment jsdom */
import { AppshellManifest } from '@appshell/config';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import jsonResource from '../src/resources/jsonResource';
import manifest from './fixtures/Manifest';
import waitForResource from './utils/waitForResource';

enableFetchMocks();

describe('jsonResource', () => {
  it('should return data when fetch succeeds', async () => {
    fetch.mockResponseOnce(() => Promise.resolve(JSON.stringify(manifest)));
    const resource = jsonResource<AppshellManifest>('http://test.com/some-resource.json');
    const data = await waitForResource(resource);

    expect(data).toEqual(manifest);
  });

  it('should return error when fetch fails', async () => {
    fetch.mockResponseOnce(() =>
      Promise.resolve({ ok: false, status: 404, statusText: 'Failed to fetch resource.' }),
    );
    const resource = jsonResource<AppshellManifest>('http://test.com/some-resource.json');

    await expect(waitForResource(resource)).rejects.toThrow(/failed to fetch resource/i);
  });
});

import { HttpStatusCode } from 'axios';
import fs from 'fs';
import axios from '../axios';
import isValidUrl from './isValidUrl';
import list from './list';

const loadJson = async <T = Record<string, unknown>>(
  jsonPathOrUrl: string,
  target: string | RegExp,
): Promise<T[]> => {
  if (isValidUrl(jsonPathOrUrl)) {
    const resp = await axios.get<T>(jsonPathOrUrl);
    if (resp.status === HttpStatusCode.Ok) {
      return [resp.data];
    }
    throw new Error(`Failed to load file from ${jsonPathOrUrl}`);
  }

  const stat = fs.statSync(jsonPathOrUrl);
  if (stat.isDirectory()) {
    const files = list(jsonPathOrUrl, 1, target);
    const entries = files.map((file) => loadJson(file, target));

    const docs = await Promise.all(entries).then((items) => items.flat() as T[]);

    return docs;
  }

  const json = JSON.parse(fs.readFileSync(jsonPathOrUrl, 'utf-8')) as T;

  return [json];
};

export default async <T = Record<string, unknown>>(
  jsonPathOrUrl: string,
  target: string | RegExp = /\.json$/i,
): Promise<T[]> => {
  const items = await loadJson<T[]>(jsonPathOrUrl, target);

  return items.flat();
};

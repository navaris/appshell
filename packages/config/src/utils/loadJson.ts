import { HttpStatusCode } from 'axios';
import fs from 'fs';
import axios from '../axios';
import isValidUrl from './isValidUrl';
import list from './list';

const loadJson = async <T extends object>(jsonPathOrUrl: string): Promise<T[]> => {
  if (isValidUrl(jsonPathOrUrl)) {
    const resp = await axios.get<T>(jsonPathOrUrl);
    if (resp.status === HttpStatusCode.Ok) {
      return [resp.data];
    }
    throw new Error(`Failed to load file from ${jsonPathOrUrl}`);
  }

  const stat = fs.statSync(jsonPathOrUrl);
  if (stat.isDirectory()) {
    const files = list(jsonPathOrUrl, 1, /\.json$/i);
    const entries = files.map(loadJson);

    return Promise.all(entries).then((items) => items.flat() as T[]);
  }

  return [JSON.parse(fs.readFileSync(jsonPathOrUrl, 'utf-8')) as T];
};

export default loadJson;

import { entries, set, values } from 'lodash';
import { AppshellConfig, ConfigMap } from './types';

const matchVariable = /(\${\w+})/;
const matchWord = /[^\w @]/g;

const findVariables = (val: string) =>
  val
    .split(matchVariable)
    .filter((w) => w.match(matchVariable))
    ?.map((w) => w.replace(matchWord, ''));

const findVariablePlaceholders = (
  obj: object | string | number | undefined,
  results: Record<string, string> = {},
): Record<string, string> =>
  values(obj).reduce((acc: Record<string, string>, val: object | string | number | undefined) => {
    if (typeof val === 'string') {
      const VARS = findVariables(val);
      return VARS.length > 0 ? VARS.reduce((a, v) => set<string>(a, v, process.env[v]), acc) : acc;
    }
    if (typeof val === 'object') {
      return findVariablePlaceholders(val, acc);
    }
    return acc;
  }, results);

const apply = <T extends object>(obj: T, configMap: ConfigMap): T => {
  entries(obj).forEach(([key, val]) => {
    if (typeof val === 'string') {
      const VARS = findVariables(val);
      if (VARS.length > 0) {
        VARS.forEach((v) => {
          const cur = obj[key];
          const value = configMap[v];
          if (!value) {
            // eslint-disable-next-line no-console
            console.log(`warning: value for ${v} is ${value}`);
          }
          set<string>(obj, key, cur.replace(`$\{${v}}`, configMap[v]));
        });
      }
    } else if (typeof val === 'object') {
      apply(val, configMap);
    }
  });

  return obj;
};

const create = (config: AppshellConfig) => findVariablePlaceholders(config);

export default {
  apply,
  create,
};

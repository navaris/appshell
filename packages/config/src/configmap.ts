import { entries, set, values } from 'lodash';
import { AppshellConfig, ConfigMap } from './types';

const matchVariable = /^(\${.*})/;
const matchWord = /[^\w @]/g;

const findVariable = (val: string) =>
  val
    .split(matchVariable)
    .find((word) => word.match(matchVariable))
    ?.replace(matchWord, '');

const findVariablePlaceholders = (
  obj: object | string | number | undefined,
  results: Record<string, string> = {},
): Record<string, string> => {
  return values(obj).reduce(
    (acc: Record<string, string>, val: object | string | number | undefined) => {
      if (typeof val === 'string') {
        const VAR = findVariable(val);
        return VAR ? set<string>(acc, VAR, process.env[VAR]) : acc;
      } else if (typeof val === 'object') {
        return findVariablePlaceholders(val, acc);
      }
      return acc;
    },
    results,
  );
};

const apply = <T extends object>(obj: T, configMap: ConfigMap): T => {
  entries(obj).forEach(([key, val]) => {
    if (typeof val === 'string') {
      const VAR = findVariable(val);
      if (VAR) {
        const value = configMap[VAR];
        if (!value) {
          console.log(`warning: value for ${VAR} is ${value}`);
        }
        set<string>(obj, key, val.replace(`$\{${VAR}\}`, configMap[VAR]));
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

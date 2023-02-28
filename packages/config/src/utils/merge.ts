import { isArray, mergeWith } from 'lodash';
import { ConfigValidator } from '../types';

const concatArrays = (objValue: unknown[], srcValue: unknown[]) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue);
  }

  return undefined;
};

export default <TSchema>(validator: ConfigValidator, ...documents: TSchema[]) => {
  if (!validator) {
    throw new Error(`No validator provided`);
  }

  // validate individual documents
  documents.forEach((document) => validator.validate(document));

  // validate prospective merge
  validator.validate(...documents);

  const merged = documents.reduce((acc, curr) => mergeWith(acc, curr, concatArrays), {}) as TSchema;

  // validate merged document
  validator.validate(merged);

  return merged;
};

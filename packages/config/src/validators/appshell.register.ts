import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import schema from '../schemas/appshell.register.json';
import { AppshellIndex, ConfigValidator } from '../types';

export default {
  validate: (...documents: AppshellIndex[]) => {
    // schema validation
    documents.forEach((document) => validate(schema as Schema, document));
  },
} as ConfigValidator;

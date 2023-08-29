import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import schema from '../schemas/appshell.config.json';
import { AppshellGlobalConfig, ConfigValidator } from '../types';

export default {
  validate: (...documents: AppshellGlobalConfig[]) => {
    // schema validation
    documents.forEach((document) => validate(schema as Schema, document));
  },
} as ConfigValidator;

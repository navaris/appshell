import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import schema from '../schemas/appshell.manifest.json';
import { AppshellManifest, ConfigValidator } from '../types';

export default {
  validate: (...documents: AppshellManifest[]) => {
    // schema validation
    documents.forEach((document) => validate(schema as Schema, document));
  },
} as ConfigValidator;

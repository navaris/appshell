import { compact, keys, uniq, uniqBy, values } from 'lodash';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import schema from '../schemas/appshell.template.json';
import { AppshellTemplate, ConfigValidator } from '../types';

const hasIDCollisions = (...documents: AppshellTemplate[]) => {
  const allRemotes = compact(documents.flatMap((document) => values(document.remotes)));
  const uniqueIds = uniqBy(allRemotes, (remote) => remote.id);

  return uniqueIds.length !== allRemotes.length;
};

const hasRemoteCollisions = (...documents: AppshellTemplate[]) => {
  const allRemoteKeys = documents.flatMap((document) => keys(document.remotes));
  const uniqueRemotes = uniq(allRemoteKeys);

  return uniqueRemotes.length !== allRemoteKeys.length;
};

const hasEnvironmentCollisions = (...documents: AppshellTemplate[]) => {
  const allEnvironmentKeys = documents.flatMap((document) => keys(document.environment));
  const uniqueEnvironments = uniq(allEnvironmentKeys);

  return uniqueEnvironments.length !== allEnvironmentKeys.length;
};

export default {
  validate: (...documents: AppshellTemplate[]) => {
    // schema validation
    documents.forEach((document) => validate(schema as Schema, document));

    // logical validation
    if (hasIDCollisions(...documents)) {
      throw new Error('Multiple remotes with the same ID');
    }

    if (hasRemoteCollisions(...documents)) {
      throw new Error('Multiple remotes with the same key');
    }

    if (hasEnvironmentCollisions(...documents)) {
      throw new Error('Multiple environments with the same key');
    }
  },
} as ConfigValidator;

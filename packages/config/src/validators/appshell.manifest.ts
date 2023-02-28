import { keys, uniq, values } from 'lodash';
import { validate } from 'schema-utils';
import { Schema } from 'schema-utils/declarations/validate';
import schema from '../schemas/appshell.manifest.json';
import { AppshellManifest, ConfigValidator } from '../types';

const hasIDCollisions = (...documents: AppshellManifest[]) => {
  const allIDs = documents.flatMap((document) =>
    values(document.remotes).map((remote) => remote.id),
  );
  const uniqueIDs = uniq(allIDs);

  return uniqueIDs.length !== allIDs.length;
};

const hasRemoteCollisions = (...documents: AppshellManifest[]) => {
  const allRemoteKeys = documents.flatMap((document) => keys(document.remotes));
  const uniqueRemotes = uniq(allRemoteKeys);

  return uniqueRemotes.length !== allRemoteKeys.length;
};

export default {
  validate: (...documents: AppshellManifest[]) => {
    // schema validation
    documents.forEach((document) => validate(schema as Schema, document));

    // logical validation
    if (hasIDCollisions(...documents)) {
      throw new Error('Multiple routes with the same ID');
    }

    if (hasRemoteCollisions(...documents)) {
      throw new Error('Multiple remotes with the same key');
    }
  },
} as ConfigValidator;

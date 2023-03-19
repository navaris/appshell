import { AppshellManifest } from '@appshell/config';
import { isError } from 'lodash';
import React, { ComponentType, FC } from 'react';
import { Resource } from '../types';
import LoadingError from './LoadingError';

type ComponentLoaderProps = {
  [key: string]: unknown;
  remote: string;
  manifest: AppshellManifest;
  resource: Resource<ComponentType>;
};

const ComponentLoader: FC<ComponentLoaderProps> = ({ remote, manifest, resource, ...rest }) => {
  const state = resource.read();

  if (!state) {
    return null;
  }

  if (isError(state)) {
    return <LoadingError remote={remote} manifest={manifest} reason={`${state}`} />;
  }

  const Component = state;
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...rest} />;
};

export default ComponentLoader;

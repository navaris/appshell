/* eslint-disable react/jsx-props-no-spreading */
import { AppshellManifest } from '@appshell/config';
import {
  FederatedComponent,
  jsonResource,
  ManifestProvider,
} from '@appshell/react-federated-component';
import { isError } from 'lodash';
import React from 'react';
import env from '../runtime.env';
import ErrorMessage from './ErrorMessage';
import Splash from './Splash';

const resource = jsonResource<AppshellManifest>(env.APPSHELL_MANIFEST_URL);
const props = JSON.parse(env.APPSHELL_ROOT_PROPS);

const RenderHost = () => {
  const value = resource.read();

  if (!value) {
    return null;
  }

  if (isError(value)) {
    return <ErrorMessage message={`${value}`} />;
  }

  return (
    <ManifestProvider manifest={value}>
      <FederatedComponent remote={env.APPSHELL_ROOT} fallback={<Splash />} {...props} />
    </ManifestProvider>
  );
};

export default RenderHost;

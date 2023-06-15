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
      <FederatedComponent remote={env.APPSHELL_ROOT} fallback={<Splash />} />
    </ManifestProvider>
  );
};

export default RenderHost;

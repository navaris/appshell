import { AppshellManifest } from '@appshell/config';
import React, { FC } from 'react';

type ErrorProps = {
  remote: string;
  reason: string;
  manifest: AppshellManifest;
};

const LoadingError: FC<ErrorProps> = ({ remote, reason, manifest }) => (
  <div>
    <h3>{`Error loading federated component '${remote}.'`}</h3>
    <span>{reason}</span>
    <pre>{JSON.stringify(manifest, null, 2)}</pre>
  </div>
);

export default LoadingError;

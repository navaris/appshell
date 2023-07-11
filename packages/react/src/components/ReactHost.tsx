/* eslint-disable react/jsx-props-no-spreading */
import { AppshellIndex, Metadata } from '@appshell/config';
import React, { FC, ReactNode, useEffect } from 'react';
import { MetadataProvider } from '../contexts/MetadataContext';
import { RegistryProvider } from '../contexts/RegistryContext';
import FederatedComponent from './FederatedComponent';

const ReactHost: FC<{
  indexUrl: string;
  metadataUrl: string;
  remote: string;
  fallback?: ReactNode;
  [x: string]: unknown;
}> = ({ indexUrl, metadataUrl, remote, fallback, ...rest }) => {
  const [index, setIndex] = React.useState<AppshellIndex>();
  const [metadata, setMetadata] = React.useState<Metadata>();

  useEffect(() => {
    const fetchIndex = async () => {
      const res = await fetch(indexUrl);

      if (res.ok) {
        const data = await res.json();
        setIndex(data);
      } else {
        setIndex({});
      }
    };

    if (!index) {
      fetchIndex();
    }
  }, [index, indexUrl]);

  useEffect(() => {
    const fetchMetadata = async () => {
      const res = await fetch(metadataUrl);

      if (res.ok) {
        const data = await res.json();
        setMetadata(data);
      } else {
        setMetadata({});
      }
    };

    if (!metadata) {
      fetchMetadata();
    }
  }, [metadata, metadataUrl]);

  if (!index || !metadata) {
    return null;
  }

  return (
    <RegistryProvider index={index}>
      <MetadataProvider metata={metadata}>
        <FederatedComponent remote={remote} fallback={fallback} {...rest} />
      </MetadataProvider>
    </RegistryProvider>
  );
};

ReactHost.defaultProps = {
  fallback: undefined,
};

export default ReactHost;

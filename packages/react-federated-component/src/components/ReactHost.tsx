/* eslint-disable react/jsx-props-no-spreading */
import { AppshellIndex, Metadata } from '@appshell/config';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { MetadataProvider } from '../contexts/MetadataContext';
import { RegistryProvider } from '../contexts/RegistryContext';
import FederatedComponent from './FederatedComponent';

const ReactHost: FC<{
  publicUrl: string;
  remote: string;
  fallback?: ReactNode;
}> = ({ publicUrl, remote, fallback, ...rest }) => {
  const [index, setIndex] = useState<AppshellIndex>();
  const [metadata, setMetadata] = useState<Metadata>();

  useEffect(() => {
    const fetchIndex = async () => {
      const res = await fetch(`${publicUrl}/appshell.index.json`);

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
  }, [index, publicUrl]);

  useEffect(() => {
    const fetchMetadata = async () => {
      const res = await fetch(`${publicUrl}/appshell.metadata.json`);

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
  }, [metadata, publicUrl]);

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

/* eslint-disable react/jsx-props-no-spreading */
import { AppshellIndex } from '@appshell/config';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { RegistryProvider } from '../contexts/RegistryContext';
import FederatedComponent from './FederatedComponent';

const ReactHost: FC<{
  indexUrl: string;
  remote: string;
  fallback?: ReactNode;
}> = ({ indexUrl, remote, fallback, ...rest }) => {
  const [index, setIndex] = useState<AppshellIndex>();

  useEffect(() => {
    const fetchIndex = async () => {
      const res = await fetch(indexUrl);

      if (res.ok) {
        const data = await res.json();
        setIndex(data);
      }
    };

    if (!index) {
      fetchIndex();
    }
  }, [index, indexUrl]);

  if (!index) {
    return null;
  }

  return (
    <RegistryProvider index={index}>
      <FederatedComponent remote={remote} fallback={fallback} {...rest} />
    </RegistryProvider>
  );
};

ReactHost.defaultProps = {
  fallback: undefined,
};

export default ReactHost;

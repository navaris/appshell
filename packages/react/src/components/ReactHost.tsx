/* eslint-disable react/jsx-props-no-spreading */
import { AppshellGlobalConfig } from 'packages/config/src/types';
import React, { FC, ReactNode, useEffect } from 'react';
import { GlobalConfigProvider } from '../contexts/GlobalConfigContext';
import AppshellComponent from './AppshellComponent';

const ReactHost: FC<{
  configUrl: string;
  remote: string;
  fallback?: ReactNode;
  [x: string]: unknown;
}> = ({ configUrl, remote, fallback, ...rest }) => {
  const [config, setGlobalConfig] = React.useState<AppshellGlobalConfig>();

  useEffect(() => {
    const fetchGlobalConfig = async () => {
      const res = await fetch(configUrl);

      if (res.ok) {
        const data = await res.json();
        setGlobalConfig(data);
      } else {
        setGlobalConfig({ index: {} });
      }
    };

    if (!config) {
      fetchGlobalConfig();
    }
  }, [config, configUrl]);

  if (!config) {
    return null;
  }

  return (
    <GlobalConfigProvider config={config}>
      <AppshellComponent remote={remote} fallback={fallback} {...rest} />
    </GlobalConfigProvider>
  );
};

ReactHost.defaultProps = {
  fallback: undefined,
};

export default ReactHost;

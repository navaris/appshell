/* eslint-disable react/jsx-props-no-spreading */
import { AppshellRegister } from 'packages/config/src/types';
import React, { FC, ReactNode, useEffect } from 'react';
import { RegistryProvider } from '../contexts/RegistryContext';
import FederatedComponent from './FederatedComponent';

const ReactHost: FC<{
  registerUrl: string;
  remote: string;
  fallback?: ReactNode;
  [x: string]: unknown;
}> = ({ registerUrl, remote, fallback, ...rest }) => {
  const [register, setRegister] = React.useState<AppshellRegister>();

  useEffect(() => {
    const fetchRegister = async () => {
      const res = await fetch(registerUrl);

      if (res.ok) {
        const data = await res.json();
        setRegister(data);
      } else {
        setRegister({ index: {} });
      }
    };

    if (!register) {
      fetchRegister();
    }
  }, [register, registerUrl]);

  if (!register) {
    return null;
  }

  return (
    <RegistryProvider register={register}>
      <FederatedComponent remote={remote} fallback={fallback} {...rest} />
    </RegistryProvider>
  );
};

ReactHost.defaultProps = {
  fallback: undefined,
};

export default ReactHost;

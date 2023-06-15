/* eslint-disable react/jsx-props-no-spreading */
import remoteLoader from '@appshell/loader';
import React, { ComponentType, ReactElement, ReactNode, useEffect, useState } from 'react';
import useManifest from '../hooks/useManifest';
import LoadingError from './LoadingError';

export type ExtendedProps = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export type FederatedComponentProps<TProps extends ExtendedProps = ExtendedProps> = {
  remote: string;
  fallback?: ReactNode;
} & TProps;

const FederatedComponent = <TProps extends ExtendedProps>({
  remote,
  fallback,
  ...rest
}: FederatedComponentProps<TProps>): ReactElement<TProps> => {
  const manifest = useManifest();
  const [element, setElement] = useState<ReactElement>();

  useEffect(() => {
    let active = false;
    const loadComponent = remoteLoader(manifest);

    async function load() {
      try {
        active = true;
        setElement(undefined);
        const Component = await loadComponent<ComponentType>(remote);
        if (!Component) {
          return;
        }
        active = false;
        setElement(React.createElement(Component, rest));
      } catch (err) {
        setElement(<LoadingError remote={remote} reason={`${err}`} />);
      }
    }

    if (!active) {
      load();
    }

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line no-console
  console.debug(`rendering FederatedComponent[${remote}], loading=${!element}`);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{element || fallback}</>;
};

FederatedComponent.defaultProps = {
  fallback: undefined,
};

export default FederatedComponent;

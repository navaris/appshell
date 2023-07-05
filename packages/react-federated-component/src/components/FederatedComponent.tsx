/* eslint-disable react/jsx-props-no-spreading */
import { AppshellIndex } from '@appshell/config';
import remoteLoader from '@appshell/loader';
import React, { ComponentType, ReactElement, ReactNode, useEffect, useState } from 'react';
import { ManifestProvider } from '../contexts/ManifestContext';
import LoadingError from './LoadingError';

export type ExtendedProps = Record<string, unknown>;

declare global {
  interface Window {
    __appshell_index__: AppshellIndex;
  }
}
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
  // eslint-disable-next-line no-underscore-dangle
  const index = window.__appshell_index__;
  const [element, setElement] = useState<ReactElement>();

  useEffect(() => {
    let active = false;
    const loadComponent = remoteLoader(index);

    async function load() {
      try {
        active = true;
        setElement(undefined);
        const [Component, manifest] = await loadComponent<ComponentType>(remote);
        if (!Component) {
          return;
        }
        active = false;
        setElement(
          <ManifestProvider manifest={manifest}>
            <Component {...rest} />
          </ManifestProvider>,
        );
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
  }, [remote, index]);

  // eslint-disable-next-line no-console
  console.debug(`rendering FederatedComponent[${remote}], loading=${!element}`);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{element || fallback}</>;
};

FederatedComponent.defaultProps = {
  fallback: undefined,
};

export default FederatedComponent;

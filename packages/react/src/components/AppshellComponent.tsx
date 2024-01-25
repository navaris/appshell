/* eslint-disable react/jsx-props-no-spreading */
import { AppshellIndex } from '@appshell/config';
import remoteLoader from '@appshell/loader';
import React, { ComponentType, ReactElement, ReactNode, useEffect, useState } from 'react';
import { ManifestProvider } from '../contexts/ManifestContext';
import useGlobalConfig from '../hooks/useGlobalConfig';
import LoadingError from './LoadingError';

export type ExtendedProps = Record<string, unknown>;

declare global {
  interface Window {
    __appshell_index__: AppshellIndex;
  }
}
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export type AppshellComponentProps<TProps extends ExtendedProps = ExtendedProps> = {
  remote: string;
  fallback?: ReactNode;
} & TProps;

const AppshellComponent = <TProps extends ExtendedProps>({
  remote,
  fallback,
  ...rest
}: AppshellComponentProps<TProps>): ReactElement<TProps> => {
  const config = useGlobalConfig();
  const [element, setElement] = useState<ReactElement>();

  useEffect(() => {
    let active = false;
    const loadComponent = remoteLoader(config);

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
  }, [remote, config, ...Object.values(rest)]);

  // eslint-disable-next-line no-console
  console.debug(`rendering AppshellComponent[${remote}], loading=${!element}`);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{element || fallback}</>;
};

AppshellComponent.defaultProps = {
  fallback: undefined,
};

export default AppshellComponent;

/**
 * @deprecated This component is deprecated and will be removed in future versions.
 * Please use AppshellComponent instead.
 */
export const FederatedComponent = AppshellComponent;

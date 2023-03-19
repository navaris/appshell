/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement, ReactNode, Suspense } from 'react';
import useManifest from '../hooks/useManifest';
import componentResource from '../resources/componentResource';
import ComponentLoader from './ComponentLoader';

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
  const resource = componentResource(remote, manifest);

  // eslint-disable-next-line no-console
  console.debug(`rendering FederatedComponent[${remote}]`);
  return (
    <Suspense fallback={fallback}>
      <ComponentLoader resource={resource} remote={remote} manifest={manifest} {...rest} />
    </Suspense>
  );
};

FederatedComponent.defaultProps = {
  fallback: undefined,
};

export default FederatedComponent;

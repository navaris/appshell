import { AppshellManifest } from '@appshell/config';
import remoteLoader from '@appshell/loader';
import { ComponentType } from 'react';

export default <TComponent extends ComponentType>(remote: string, manifest: AppshellManifest) => {
  const loadComponent = remoteLoader(manifest);

  let status = 'pending';
  let result: TComponent | Error;
  const suspender = loadComponent<TComponent>(remote)
    .then((Component) => {
      status = 'success';
      result = Component;
    })
    .catch((reason) => {
      status = 'error';
      result = new Error(`${reason}`);
    });

  return {
    read() {
      if (status === 'pending') {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw suspender;
      } else if (status === 'error') {
        throw result as Error;
      } else if (status === 'success') {
        return result;
      }

      return undefined;
    },
  };
};

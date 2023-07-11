import { AppshellManifest } from '@appshell/config';
import type { FC, ReactNode } from 'react';
import React, { createContext } from 'react';

interface ManifestProviderProps {
  manifest: AppshellManifest;
  children: ReactNode;
}

export const ManifestContext = createContext<AppshellManifest>({
  remotes: {},
  modules: {},
  environment: {},
});

export const ManifestProvider: FC<ManifestProviderProps> = ({ manifest, children }) => (
  <ManifestContext.Provider value={manifest}>{children}</ManifestContext.Provider>
);

export const ManifestConsumer = ManifestContext.Consumer;

export default ManifestContext;

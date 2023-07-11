import { Metadata } from '@appshell/config';
import React, { createContext, FC, ReactNode } from 'react';

interface MetadataProviderProps {
  metata: Metadata;
  children: ReactNode;
}

export const MetadataContext = createContext<Metadata>({});

export const MetadataProvider: FC<MetadataProviderProps> = ({ metata, children }) => (
  <MetadataContext.Provider value={metata}>{children}</MetadataContext.Provider>
);

export const MetadataConsumer = MetadataContext.Consumer;

export default MetadataContext;

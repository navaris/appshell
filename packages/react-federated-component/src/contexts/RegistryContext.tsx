import { AppshellIndex } from '@appshell/config';
import React, { createContext, FC, ReactNode } from 'react';

interface RegistryProviderProps {
  index: AppshellIndex;
  children: ReactNode;
}

export const RegistryContext = createContext<AppshellIndex>({});

export const RegistryProvider: FC<RegistryProviderProps> = ({ index, children }) => (
  <RegistryContext.Provider value={index}>{children}</RegistryContext.Provider>
);

export const RegistryConsumer = RegistryContext.Consumer;

export default RegistryContext;

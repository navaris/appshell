import { AppshellGlobalConfig } from 'packages/config/src/types';
import React, { createContext, FC, ReactNode } from 'react';

interface GlobalConfigProviderProps {
  config: AppshellGlobalConfig;
  children: ReactNode;
}

export const GlobalConfigContext = createContext<AppshellGlobalConfig>({ index: {} });

export const GlobalConfigProvider: FC<GlobalConfigProviderProps> = ({ config, children }) => (
  <GlobalConfigContext.Provider value={config}>{children}</GlobalConfigContext.Provider>
);

export const GlobalConfigConsumer = GlobalConfigContext.Consumer;

export default GlobalConfigContext;

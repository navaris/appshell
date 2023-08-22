import { AppshellRegister } from 'packages/config/src/types';
import React, { createContext, FC, ReactNode } from 'react';

interface RegistryProviderProps {
  register: AppshellRegister;
  children: ReactNode;
}

export const RegistryContext = createContext<AppshellRegister>({ index: {} });

export const RegistryProvider: FC<RegistryProviderProps> = ({ register, children }) => (
  <RegistryContext.Provider value={register}>{children}</RegistryContext.Provider>
);

export const RegistryConsumer = RegistryContext.Consumer;

export default RegistryContext;

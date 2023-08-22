import { AppshellRegister } from 'packages/config/src/types';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import RegistryContext from '../contexts/RegistryContext';

export default (): AppshellRegister => React.useContext<AppshellRegister>(RegistryContext);

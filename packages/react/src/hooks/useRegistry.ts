import { AppshellIndex } from '@appshell/config';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import RegistryContext from '../contexts/RegistryContext';

export default (): AppshellIndex => React.useContext<AppshellIndex>(RegistryContext);

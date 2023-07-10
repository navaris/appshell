import { Metadata } from '@appshell/config';
import React from 'react';
// eslint-disable-next-line import/no-named-as-default
import MetadataContext from '../contexts/MetadataContext';

export default (): Metadata => React.useContext<Metadata>(MetadataContext);

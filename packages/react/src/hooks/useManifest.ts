import { AppshellManifest } from '@appshell/config';
import React from 'react';

// eslint-disable-next-line import/no-named-as-default
import ManifestContext from '../contexts/ManifestContext';

export default (): AppshellManifest => React.useContext<AppshellManifest>(ManifestContext);

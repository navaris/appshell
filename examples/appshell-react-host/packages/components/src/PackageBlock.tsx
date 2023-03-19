import React, { FC } from 'react';

type PackageBlockProps = {
  name: string;
  version: string;
};

const PackageBlock: FC<PackageBlockProps> = ({ name, version }) => (
  <pre>
    {name} v{version}
  </pre>
);

export default PackageBlock;

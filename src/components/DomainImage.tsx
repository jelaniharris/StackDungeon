import Image from 'next/image';

import { DomainDataType } from '@/components/SelectStacks';

type DomainImageParams = {
  domainData: DomainDataType;
  width: number;
  height: number;
};

const DomainImage = ({ domainData, width, height }: DomainImageParams) => {
  return (
    <>
      <Image
        src={domainData.logo}
        alt={domainData.name}
        width={width}
        height={height}
      />
    </>
  );
};

export default DomainImage;

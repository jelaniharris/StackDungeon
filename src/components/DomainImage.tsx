import Image from 'next/image';

import { DomainDataType } from '@/components/SelectStacks';

type DomainImageParams = {
  domainData?: DomainDataType;
  width: number;
  height: number;
  alt?: string;
};

const DomainImage = ({ domainData, width, height, alt }: DomainImageParams) => {
  if (!domainData) {
    return <></>;
  }

  return (
    <>
      <Image
        src={domainData.logo}
        alt={alt || domainData.name}
        width={width}
        height={height}
      />
    </>
  );
};

export default DomainImage;

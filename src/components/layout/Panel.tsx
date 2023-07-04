import React from 'react';

export type PanelType = {
  children: React.ReactNode;
  title?: string;
};

const Panel = ({ children, title }: PanelType) => {
  return (
    <div>
      {title && <h1 className='mb-6 text-left'>{title}</h1>}
      <div className='rounded-md bg-background-secondary p-4'>{children}</div>
    </div>
  );
};

export default Panel;

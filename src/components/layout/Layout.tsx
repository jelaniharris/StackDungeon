import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <main className='container mx-auto px-4 py-2'>{children}</main>
    </>
  );
};

export default Layout;

import React from 'react';

import Header from '@/components/layout/Header';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Header />
      <main className='container mx-auto px-4 py-2'>{children}</main>
    </>
  );
};

export default Layout;

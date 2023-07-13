'use client';

import type { NextPage } from 'next';

import Layout from '@/components/layout/Layout';
import ModeSelect from '@/components/ModeSelect';

const Home: NextPage = () => {
  return (
    <Layout>
      <div className='flex h-screen flex-col items-center justify-center font-bold'>
        <h1>Welcome to StackDungeon</h1>
        <ModeSelect />
      </div>
    </Layout>
  );
};
export default Home;

'use client';

import type { NextPage } from 'next';
import Link from 'next/link';

import Layout from '@/components/layout/Layout';
import ModeSelect from '@/components/ModeSelect';
import { ShowFloors } from '@/components/ShowFloors';

const Home: NextPage = () => {
  return (
    <Layout>
      <div className='flex h-screen flex-col items-center justify-center font-bold'>
        Welcome to StackDungeon
        <ModeSelect />
        <ShowFloors />
        <Link href='/quiz?domain=reactjs'>ReactJs Quiz</Link>
        <Link href='/quiz?domain=ruby-on-rails'>Ruby On Rails Quiz</Link>
        <Link href='/quiz?domain=nodejs'>NodeJs Quiz</Link>
        <Link href='/quiz?domain=javascript'>Javascript Quiz</Link>
      </div>
    </Layout>
  );
};
export default Home;

'use client';

import Link from 'next/link';

const ModeSelect = () => {
  return (
    <div className='flex flex-row'>
      <Link
        href='/assessments'
        className='mr-6 rounded-md  bg-background-secondary p-5 hover:bg-background-500 hover:text-white'
      >
        <h2 className='mb-3'>Assessments</h2>
        <p>
          Take the regular assessment without any RPG features. Just you, 10
          questions, and the clock.
        </p>
      </Link>
      <Link href='/game' className='mr-6 rounded-md bg-gray-200 p-5'>
        <h2 className='mb-3'>Roguelite</h2>
        <p>
          The original mode of Stack Dungeon. Select your domains of study and
          go as deep as you can into the tech labyrinth and make it out not only
          alive, but smarter.
        </p>
        <div className='rounded-lg bg-yellow-400 p-4 text-center text-yellow-800'>
          Currently In Development
        </div>
      </Link>
    </div>
  );
};

export default ModeSelect;

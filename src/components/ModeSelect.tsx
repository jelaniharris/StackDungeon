'use client';

import Link from 'next/link';

const ModeSelect = () => {
  return (
    <div className='flex flex-row items-center'>
      <Link
        href='/assessments'
        className='mr-6 rounded-md bg-background-secondary p-5 hover:bg-background-300 hover:text-white'
      >
        <h2>Assessments</h2>
        <p>
          Take the regular assessment without any RPG features. Just you, 10
          questions, and the clock.
        </p>
      </Link>
      <Link
        href='/game'
        className='mr-6 rounded-md bg-background-secondary  p-5 hover:bg-background-300 hover:text-white'
      >
        Roguelite
        <p>
          The original mode of Stack Dungeon. Select your domains of study and
          go as deep as you can into the tech labyrinth and make it out not only
          alive, but smarter.
        </p>
      </Link>
    </div>
  );
};

export default ModeSelect;

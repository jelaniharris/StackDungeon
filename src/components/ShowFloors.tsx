'use client';

import { useEffect, useState } from 'react';

import { DungeonSelector } from '@/components/DungeonSelector';

import { useAppSelector } from '@/store';
import { Dungeon } from '@/store/Features/dungeon/DungeonSlice';

import { generateDungeons } from '@/app/lib/DungeonLib';

export const ShowFloors = () => {
  const quest = useAppSelector((state) => state.quest);
  const [dungeonData, setDungeonData] = useState<Dungeon[]>();

  useEffect(() => {
    const dungeons = generateDungeons(quest.currentFloor);
    setDungeonData(dungeons);
  }, [quest]);

  if (!dungeonData) {
    return <>Generating Dungeons</>;
  }

  const assignDungeon = (dungeon: Dungeon) => {
    console.log('Clicked on', dungeon.name);
  };

  return (
    <>
      <h2> Floor {quest.currentFloor}</h2>
      <div className='flex flex-row items-center'>
        {dungeonData.map((dung, i) => {
          return (
            <DungeonSelector
              key={`dungeon-id-${i}`}
              dungeon={dung}
              onSelected={assignDungeon}
            />
          );
        })}
      </div>
    </>
  );
};

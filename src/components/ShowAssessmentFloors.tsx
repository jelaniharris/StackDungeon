'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { DungeonSelector } from '@/components/DungeonSelector';
import { DOMAIN_DATA } from '@/components/SelectStacks';

import { useAppSelector } from '@/store';
import { Dungeon } from '@/store/Features/dungeon/DungeonSlice';
import { dungeonAction } from '@/store/Features/dungeon/DungeonSlice';
import { quizAction } from '@/store/Features/quiz/quizSlice';

interface ShowAssessmentFloorsParams {
  title: string;
}

export const ShowAssessmentFloors = ({ title }: ShowAssessmentFloorsParams) => {
  const [quest, character] = useAppSelector((state) => [
    state.quest,
    state.character,
  ]);
  const dispatch = useDispatch();
  const [dungeonData, setDungeonData] = useState<Dungeon[]>();
  const { push } = useRouter();

  useEffect(() => {
    const newDungeonData: Dungeon[] = [];

    const domains = character.domains;
    const numQuestions = 3;

    // Generating one dungeon per domain
    domains.forEach((domain) => {
      const domainData = DOMAIN_DATA.find((data) => data.slug === domain);
      const newDungeon: Dungeon = {
        name: `Assessment ${domainData?.name}`,
        hasTimer: true,
        difficulty: 0,
        numberOfQuestions: numQuestions,
        timePerQuestion: 90,
        difficultyReasons: [],
        domains: [domain],
      };
      newDungeonData.push(newDungeon);
    });

    if (domains.length > 1) {
      const newAllDungeon: Dungeon = {
        name: `Assessment All`,
        hasTimer: true,
        difficulty: 0,
        numberOfQuestions: numQuestions,
        timePerQuestion: 90,
        difficultyReasons: [],
        domains: domains,
      };
      newDungeonData.push(newAllDungeon);
    }

    // And another containing all of them
    const dungeons = newDungeonData;
    setDungeonData(dungeons);
  }, [character.domains, quest]);

  if (!dungeonData) {
    return <>Generating Dungeons</>;
  }

  const assignDungeon = async (dungeon: Dungeon) => {
    console.log('Clicked on', dungeon.name);
    // Reset the answer set
    await dispatch(quizAction.resetAnswerSet());
    await dispatch(dungeonAction.setDungeon(dungeon));
    push('/quiz');
  };

  return (
    <>
      {title && <h2> {title}</h2>}
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

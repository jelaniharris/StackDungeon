'use client';
import { MouseEventHandler, useState } from 'react';
import {
  FaPercent as PassPercentage,
  FaRegClock as ClockIcon,
  FaSkull,
} from 'react-icons/fa';

import clsxm from '@/lib/clsxm';

import DomainImage from '@/components/DomainImage';
import { DOMAIN_DATA } from '@/components/SelectStacks';

import { Dungeon } from '@/store/Features/dungeon/DungeonSlice';

interface DungeonSelectorParams {
  dungeon: Dungeon;
  onSelected: (dungeon: Dungeon) => void;
}

export const DungeonSelector = ({
  dungeon,
  onSelected,
}: DungeonSelectorParams) => {
  const [modText, setModText] = useState('');

  const DungonMod = ({
    type,
    alt,
    onMouseOver,
    onMouseOut,
    text,
  }: {
    type: string;
    alt: string;
    text: string;
    onMouseOver: MouseEventHandler;
    onMouseOut: MouseEventHandler;
  }) => {
    let typeIcon;

    switch (type) {
      case 'timer':
        typeIcon = <ClockIcon />;
        break;
      case 'percentage':
        typeIcon = <PassPercentage />;
        break;
      default:
        typeIcon = <></>;
        break;
    }

    return (
      <div
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
        aria-label={alt}
        className='rounded-md border-2 border-gray-300 bg-gray-100 p-3'
      >
        <div className='flex flex-col items-center gap-2 text-6xl'>
          {typeIcon}
          <span className='text-2xl'>{text}</span>
        </div>
      </div>
    );
  };

  const ClearHoverModText = () => {
    setModText('');
  };

  const SetHoverModText = (text: string) => {
    setModText(text);
  };

  const HasPassPercentage = () => {
    if (!dungeon.passPercentage) {
      return <></>;
    }
    return (
      <DungonMod
        onMouseOver={() => SetHoverModText('Pass Percentage')}
        onMouseOut={ClearHoverModText}
        alt='Pass Percentage'
        type='percentage'
        text={`${Math.round(dungeon.passPercentage * 100)}%`}
      />
    );
  };

  const HasTimer = () => {
    if (!dungeon.hasTimer) {
      return <></>;
    }
    return (
      <DungonMod
        alt='Timelimit Per Question'
        onMouseOver={() => SetHoverModText('Timelimit Per Question')}
        onMouseOut={ClearHoverModText}
        type='timer'
        text={`${dungeon.timePerQuestion}s`}
      />
    );
  };

  const ShowDungeonMods = () => {
    return (
      <div className='fa-row flex items-center justify-center gap-3'>
        <HasTimer />
        <HasPassPercentage />
      </div>
    );
  };

  const ShowSkulls = () => {
    const skulls = [];

    // no difficulty, no skulls
    if (dungeon.difficulty === 0) {
      return <></>;
    }

    // Less than 5, show all 5 because it's cool
    if (dungeon.difficulty < 5) {
      {
        for (let i = 1; i <= dungeon.difficulty; i++) {
          skulls.push(
            <div className='' key={`skull-${dungeon.name}-${i}`}>
              <FaSkull />
            </div>
          );
        }
      }

      // More than 5, show just a number and a skull
      return (
        <div className='mt-4 flex flex-row items-center justify-center gap-2'>
          {skulls}
        </div>
      );
    }

    return (
      <div className='mt-4 flex flex-row items-center justify-center gap-4'>
        <FaSkull />
        <span>{dungeon.difficulty}</span>
      </div>
    );
  };

  const ShowNumberQuestions = () => {
    return <>Questions: {dungeon.numberOfQuestions}</>;
  };

  const clickedDungeon = () => {
    if (onSelected) {
      onSelected(dungeon);
    }
  };

  const ShowDomains = () => {
    return (
      <div className='flex flex-row items-center gap-3'>
        {dungeon.domains.map((domain, i) => {
          const domainData = DOMAIN_DATA.find((data) => data.slug === domain);

          if (!domainData) {
            return <></>;
          }

          return (
            <div
              key={`domain-type-${i}`}
              className='rounded-md bg-gray-200 p-2'
            >
              <DomainImage domainData={domainData} width={32} height={32} />
            </div>
          );
        })}
      </div>
    );
  };

  const ShowModText = () => {
    const isVisible = modText && modText.length > 0;
    return (
      <h4
        className={clsxm([
          isVisible && 'w-full rounded-lg bg-gray-100 px-4 py-1 text-text',
          !isVisible && 'bg-transparent',
        ])}
      >
        {isVisible ? modText : <span>&nbsp;</span>}
      </h4>
    );
  };

  return (
    <div className='group w-1/3'>
      <button
        className='m-2 flex flex-col items-center rounded-b-md bg-background-secondary group-hover:bg-accent-100'
        onClick={clickedDungeon}
      >
        <div className='w-full rounded-t-md bg-accent-100 p-4 text-center group-hover:bg-accent-200'>
          <h2>{dungeon.name}</h2>
        </div>
        <div className='flex flex-col gap-4 p-4'>
          <div className='flex flex-row items-center gap-2'>
            <ShowDomains />
          </div>
          <ShowDungeonMods />
          <ShowModText />

          <div className='text-center'>
            <ShowNumberQuestions />
          </div>
          <ShowSkulls />
        </div>
      </button>
    </div>
  );
};

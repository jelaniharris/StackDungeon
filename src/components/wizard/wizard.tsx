'use client';

import React from 'react';
import { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import Button from '@/components/buttons/Button';

export type WizardType = {
  children: React.ReactNode;
  title?: string;
};

const Wizard = ({ children }: WizardType) => {
  const [activePage, setActivePage] = useState(0);

  const pages = React.Children.toArray(children);
  const currentPage = pages[activePage];

  const onPrevClick = () => {
    setActivePage((index) => index - 1);
  };

  const onNextClick = () => {
    setActivePage((index) => index + 1);
  };

  return (
    <>
      <div className=''>{currentPage}</div>
      <div className='mt-6 grid w-full grid-cols-4 gap-4'>
        <div className='col-span-2 text-right'>
          {activePage > 0 ? (
            <Button
              onClick={onPrevClick}
              leftIcon={FaArrowLeft}
              leftIconClassName='mr-4'
            >
              Back
            </Button>
          ) : null}
        </div>
        <div className='col-span-2'>
          {activePage < pages.length - 1 ? (
            <Button
              className='col-span-2'
              rightIcon={FaArrowRight}
              onClick={onNextClick}
              rightIconClassName='ml-4'
            >
              Next
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Wizard;

import React, { useCallback, useEffect, useState } from 'react';

import DomainImage from '@/components/DomainImage';
import { useCountdown } from '@/components/hooks/UseCountdown';
import { Markdown } from '@/components/Markdown';
import { DOMAIN_DATA } from '@/components/SelectStacks';

import { useAppSelector } from '@/store';

import { QuestionType } from '@/schema/question.schema';

import QuestionAnswers from './questionAnswers';

type QuestionFormParams = {
  question: QuestionType;
  questionNumber: number;
  onResult: (result: boolean) => void;
};

const QuestionForm = ({
  question,
  questionNumber,
  onResult,
}: QuestionFormParams) => {
  const [selectedAnswer, setSelectAnswer] = useState<number | null>(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const timeHasExpired = useCallback(() => {
    console.log('Time expired');
    setTimeExpired(true);
    setConfirmedAnswer(true);
  }, []);
  const { counter, startTimer, stopTimer } = useCountdown({
    onComplete: timeHasExpired,
  });

  const dungeon = useAppSelector((state) => state.dungeon);

  useEffect(() => {
    console.log('Use effect');
    if (dungeon.dungeon.timePerQuestion) {
      startTimer(dungeon.dungeon.timePerQuestion);
    }
  }, [dungeon, startTimer]);

  const onAnswerSelect = (answerIndex: number) => {
    console.log('Selected answer index: ', answerIndex);
    console.log('Correct question answer index: ', question.correctAnswers);
    setSelectAnswer(answerIndex);
  };

  const advanceQuiz = () => {
    if (
      selectedAnswer != null &&
      question.correctAnswers.includes(selectedAnswer)
    ) {
      onResult(true);
    } else {
      onResult(false);
    }
  };

  const onSubmitAnswer = () => {
    setConfirmedAnswer(true);
    stopTimer();
  };

  const QuestionContent = ({ content }: { content: string }) => {
    if (!content || content.trim().length == 0) {
      return <></>;
    }
    return <Markdown content={content} />;
  };

  const ShowCorrectWrong = () => {
    if (!confirmedAnswer) {
      return <></>;
    }

    // If they selected an answer or time has expired
    let result = false;

    // If they ran out of time, then it's wrong
    if (timeExpired) {
      result = false;
    }

    if (
      confirmedAnswer &&
      selectedAnswer != null &&
      question.correctAnswers.includes(selectedAnswer)
    ) {
      result = true;
    }

    if (!result) {
      return (
        <div className='bg-red-100 p-3 text-center text-xl text-red-600'>
          Incorrect
        </div>
      );
    }
    return (
      <div className='bg-green-100 p-3 text-center text-xl text-green-600'>
        Correct
      </div>
    );
  };

  const domainData = DOMAIN_DATA.find((data) => data.slug === question.domain);

  return (
    <div className='rounded-md bg-background-secondary p-8 text-text'>
      <div className='text-center'>
        {!timeExpired && (
          <h3>
            Time Left: {Math.floor(counter / 60)}:
            {(counter % 60).toString().padStart(2, '0')}
          </h3>
        )}
        {timeExpired && <h3>Time's Up!</h3>}
      </div>
      <div className='mb-7 flex flex-row items-center justify-between'>
        <div className='rounded-md bg-accent-200 p-2'>
          <DomainImage domainData={domainData} width={40} height={40} />
        </div>
        <h1 className='text-center text-2xl font-bold '>{`Question ${Number(
          questionNumber + 1
        )}`}</h1>
        <span></span>
      </div>
      <h2 className='text-xl font-medium'>{question.question}</h2>

      <QuestionContent content={question.content || ''} />

      {question.answers && (
        <QuestionAnswers
          selectedAnswer={selectedAnswer}
          question={question}
          onAnswerSelect={onAnswerSelect}
          confirmedAnswer={confirmedAnswer}
        />
      )}
      {confirmedAnswer && (
        <div className='flex flex-col gap-4'>
          <ShowCorrectWrong />
          {question.answerInfo && question.answerInfo.length > 0 && (
            <p className='mt-5'>{question.answerInfo}</p>
          )}
        </div>
      )}
      <div className='mt-5 flex flex-row items-center justify-around gap-3'>
        {!confirmedAnswer && (
          <button
            className='rounded-md bg-primary-700 p-3 text-white'
            onClick={onSubmitAnswer}
          >
            Submit Answer
          </button>
        )}
        {confirmedAnswer && (
          <button
            className='rounded-md bg-primary-700 p-3 text-white'
            onClick={advanceQuiz}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionForm;

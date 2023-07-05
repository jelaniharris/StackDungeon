import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

import DomainImage from '@/components/DomainImage';
import { DOMAIN_DATA } from '@/components/SelectStacks';

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
  const [style, setStyle] = useState({});
  const [selectedAnswer, setSelectAnswer] = useState<number | null>(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState(false);
  const [timeExpired] = useState(false);

  useEffect(() => {
    import('react-syntax-highlighter/dist/esm/styles/hljs').then((mod) =>
      setStyle(mod.default)
    );
  });

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
  };

  const QuestionContent = ({ content }: { content: string }) => {
    if (!content || content.trim().length == 0) {
      return <></>;
    }
    return (
      <div className='mt-4 rounded-xl bg-background-400 p-4'>
        <SyntaxHighlighter language='javascript' style={style}>
          {content}
        </SyntaxHighlighter>
      </div>
    );
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

import clsx from 'clsx';
import React from 'react';

import { QuestionType } from '@/schema/question.schema';

type QuestionAnswersParams = {
  question: QuestionType;
  onAnswerSelect: (index: number) => void;
  selectedAnswer: number | null;
  confirmedAnswer: boolean;
};

const QuestionAnswers = ({
  question,
  onAnswerSelect,
  selectedAnswer,
  confirmedAnswer,
}: QuestionAnswersParams) => {
  return (
    <ul className='my-4'>
      {question.answers.map((answer, index) => {
        const isSelectedAnswer = selectedAnswer == index;
        const isCorrectAnswer = question.correctAnswer == index;

        return (
          <li
            key={`answer-key-${index}`}
            className={clsx([
              'my-2 cursor-pointer rounded-md bg-slate-200 p-3 text-black',
              !confirmedAnswer && 'hover:bg-blue-600 hover:text-gray-300',
              //confirmedAnswer && 'bg-slate-400',
              isSelectedAnswer && 'bg-blue-500 text-white',
              confirmedAnswer &&
                isSelectedAnswer &&
                isCorrectAnswer &&
                'bg-green-500 text-white',
              confirmedAnswer &&
                isSelectedAnswer &&
                !isCorrectAnswer &&
                'bg-red-500 text-white',
            ])}
            onClick={() => {
              if (!confirmedAnswer) {
                onAnswerSelect(index);
              }
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: answer }} />
          </li>
        );
      })}
    </ul>
  );
};

export default QuestionAnswers;

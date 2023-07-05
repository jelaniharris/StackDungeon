import React from 'react';

import clsxm from '@/lib/clsxm';

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
  console.log(question);
  return (
    <ul className='my-4'>
      {question.answers.map((answer, index) => {
        // Is this answer the one the user selected
        const isSelectedAnswer = selectedAnswer == index;

        // Is this answer the correct answer
        const isCorrectAnswer = question.correctAnswers.includes(index);

        const isAnswerRight = isSelectedAnswer && isCorrectAnswer;

        return (
          <li
            key={`answer-key-${index}`}
            className={clsxm([
              'my-2 cursor-pointer rounded-md bg-slate-200 p-3 text-black',
              // They did not select an answer, all of them can be hovered over
              !confirmedAnswer && 'hover:bg-blue-600 hover:text-gray-300',
              // Is the selected answer and is not confirmed
              !confirmedAnswer && isSelectedAnswer && 'bg-blue-500 text-white',
              // Is selected, and is the correct one
              confirmedAnswer &&
                !isSelectedAnswer &&
                !isCorrectAnswer &&
                'opacity-50',
              confirmedAnswer && isAnswerRight && 'bg-green-500 text-white',
              confirmedAnswer && isCorrectAnswer && 'bg-green-500 text-white',
              // Is selected, and is the wrong one
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

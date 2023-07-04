import React from 'react';

import { QuestionType } from '@/schema/question.schema';

type QuestionAnswersParams = {
  question: QuestionType;
  onAnswerSelect: (index: number) => void;
};

const QuestionAnswers = ({
  question,
  onAnswerSelect,
}: QuestionAnswersParams) => {
  return (
    <ul className='my-4 w-1/3'>
      {question.answers.map((answer, index) => (
        <li
          key={`answer-key-${index}`}
          className='my-2 cursor-pointer rounded-md bg-slate-200 p-3 text-black hover:bg-blue-600 hover:text-gray-300'
          onClick={() => onAnswerSelect(index)}
        >
          <div dangerouslySetInnerHTML={{ __html: answer }} />
        </li>
      ))}
    </ul>
  );
};

export default QuestionAnswers;

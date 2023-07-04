import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

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

  useEffect(() => {
    import('react-syntax-highlighter/dist/esm/styles/hljs').then((mod) =>
      setStyle(mod.default)
    );
  });

  const onAnswerSelect = (answerIndex: number) => {
    setSelectAnswer(answerIndex);
  };

  const advanceQuiz = () => {
    if (selectedAnswer == Number(question.correctAnswer)) {
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

  return (
    <div className='rounded-md bg-background-secondary p-8 text-text'>
      <h1 className='text-center text-2xl font-bold'>{`Question ${
        questionNumber ? Number(questionNumber) + 1 : '?'
      }`}</h1>
      <h2 className='text-xl font-medium'>{question.question}</h2>
      <h5>{question.domain}</h5>

      <QuestionContent content={question.content || ''} />

      {question.answers && (
        <QuestionAnswers
          selectedAnswer={selectedAnswer}
          question={question}
          onAnswerSelect={onAnswerSelect}
          confirmedAnswer={confirmedAnswer}
        />
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

'use client';

import React, { useCallback, useEffect, useState } from 'react';

import Layout from '@/components/layout/Layout';
import AnswerSet from '@/components/question/answerset';
import QuestionForm from '@/components/question/questionForm';

import { useAppSelector } from '@/store';

import { getQuestions } from '@/app/lib/QuestionData';
import { GetQuestions, QuestionType } from '@/schema/question.schema';

type DisplayQuestionParams = {
  question: QuestionType;
  questionNumber: number;
};

const Quiz = () => {
  const [data, setData] = useState<GetQuestions | null>();
  const [isLoading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answerSet, setAnswerSet] = useState<Array<boolean | null>>([]);

  const [dungeon] = useAppSelector((state) => [state.dungeon]);

  /*const pageSearchParams = useSearchParams();
  const desiredDomain = pageSearchParams
    ? pageSearchParams.get('domain') || ''
    : '';*/

  const loadQuestions = useCallback(async () => {
    if (data || isLoading) {
      return;
    }

    if (!dungeon) {
      console.error('Could not find current dungeon');
    }

    setLoading(true);

    const questionData = await getQuestions({
      domains: dungeon.dungeon.domains,
    });

    // Assign the data loaded
    setData(questionData);
    // Reset the answer set
    const emptyAnswers: Array<boolean | null> = [];
    for (let k = 0; k < questionData.questions.length; k++) {
      emptyAnswers.push(null);
    }
    setAnswerSet(emptyAnswers);
    setLoading(false);
  }, [data, dungeon, isLoading]);

  useEffect(() => {
    console.log('Loading Questions');
    loadQuestions();
  }, [loadQuestions]);

  const onResult = (result: boolean) => {
    const answers = answerSet;
    if (answers) {
      answers[currentQuestion] = result;
      setAnswerSet(answers);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const DisplayQuestion = ({
    question,
    questionNumber,
  }: DisplayQuestionParams) => {
    return (
      <QuestionForm
        key={question.id}
        onResult={onResult}
        question={question}
        questionNumber={questionNumber}
      />
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No question data?</p>;

  return (
    <Layout>
      <div className='flex h-screen flex-col items-center justify-center'>
        {data && data.questions && (
          <DisplayQuestion
            question={data.questions[currentQuestion]}
            questionNumber={currentQuestion}
          />
        )}
        <AnswerSet currentQuestion={currentQuestion} answerSet={answerSet} />
      </div>
    </Layout>
  );
};

export default Quiz;

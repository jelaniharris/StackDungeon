'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Layout from '@/components/layout/Layout';
import AnswerSet from '@/components/question/answerset';
import DisplayQuestion from '@/components/question/DisplayQuestion';
import QuizResults from '@/components/question/QuizResults';

import { useAppSelector } from '@/store';
import { quizAction } from '@/store/Features/quiz/quizSlice';

import { getQuestions } from '@/app/lib/QuestionData';

const Quiz = () => {
  const [isLoading, setLoading] = useState(false);

  const [dungeon, quiz] = useAppSelector((state) => [
    state.dungeon,
    state.quiz,
  ]);
  const dispatch = useDispatch();

  const pageSearchParams = useSearchParams();
  const desiredDomain = pageSearchParams
    ? pageSearchParams.get('domain') || ''
    : '';
  const desiredNumberOfQuestions = pageSearchParams
    ? parseInt(pageSearchParams.get('numberOfQuestions') || '', 10) || ''
    : 3;

  useEffect(() => {
    console.log('Loading Questions');
    const loadQuestions = async () => {
      if (!dungeon) {
        console.error('Could not find current dungeon');
      }

      // Set as loading
      setLoading(true);

      console.log('Actually getting data ...');

      const questionData = await getQuestions({
        domains: [desiredDomain] || dungeon.dungeon.domains,
        numberOfQuestions:
          desiredNumberOfQuestions || dungeon.dungeon.numberOfQuestions,
      });

      // Assign the data loaded
      dispatch(quizAction.setQuestions(questionData));

      // Reset the answer set
      dispatch(quizAction.resetAnswerSet());

      // Set as no longer loading
      setLoading(false);
    };

    if (quiz.questions.length == 0 && !isLoading) {
      loadQuestions();
    }
  }, [
    desiredDomain,
    desiredNumberOfQuestions,
    dispatch,
    dungeon,
    isLoading,
    quiz.questions.length,
  ]);

  if (isLoading)
    return (
      <Layout>
        <p>Loading Questions...</p>
      </Layout>
    );
  if (!quiz.questions || quiz.questions.length === 0)
    return <p>No question data?</p>;

  return (
    <Layout>
      <div className='flex h-screen flex-col items-center justify-center'>
        {quiz.reviewMode && (
          <>
            <QuizResults
              questions={quiz.questions}
              answerSet={quiz.answerSet}
            />
          </>
        )}
        {quiz && quiz.questions && !quiz.reviewMode && (
          <DisplayQuestion
            question={quiz.questions[quiz.currentQuestion]}
            questionNumber={quiz.currentQuestion}
          />
        )}
        <AnswerSet
          currentQuestion={quiz.currentQuestion}
          answerSet={quiz.answerSet}
        />
      </div>
    </Layout>
  );
};

export default Quiz;

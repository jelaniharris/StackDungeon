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

  useEffect(() => {
    console.log('Loading Questions');
    const loadQuestions = async () => {
      if (!dungeon) {
        console.error('Could not find current dungeon');
      }

      // Set as loading
      setLoading(true);

      console.log('Actually getting data ...');

      let desiredDomain = dungeon.dungeon.domains;
      if (pageSearchParams && pageSearchParams.has('domain')) {
        desiredDomain = [pageSearchParams.get('domain') || ''];
      }

      let desiredNumberOfQuestions: number | null =
        dungeon.dungeon.numberOfQuestions;
      if (pageSearchParams && pageSearchParams.has('numberOfQuestions')) {
        desiredNumberOfQuestions = parseInt(
          pageSearchParams.get('numberOfQuestions') || '0',
          10
        );
      }

      const questionData = await getQuestions({
        domains: desiredDomain,
        numberOfQuestions: desiredNumberOfQuestions,
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
  }, [dispatch, dungeon, isLoading, pageSearchParams, quiz.questions.length]);

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

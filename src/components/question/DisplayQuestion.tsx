import { useDispatch } from 'react-redux';

import QuestionForm from '@/components/question/QuestionForm';

import { useAppSelector } from '@/store';
import { quizAction } from '@/store/Features/quiz/quizSlice';

import { QuestionType } from '@/schema/question.schema';

interface DisplayQuestionParams {
  question: QuestionType;
  questionNumber: number;
}

const DisplayQuestion = ({
  question,
  questionNumber,
}: DisplayQuestionParams) => {
  const dispatch = useDispatch();

  const [quiz] = useAppSelector((state) => [state.quiz]);

  const onResult = (result: boolean) => {
    if (quiz.answerSet) {
      dispatch(
        quizAction.assignAnswer({
          questionNumber: quiz.currentQuestion,
          questionResult: result,
        })
      );

      const nextQuestion = quiz.currentQuestion + 1;
      // If the next question is greater tha
      if (quiz && nextQuestion >= quiz.questions.length) {
        dispatch(quizAction.setReviewMode(true));
      }
      dispatch(quizAction.setCurrentQuestion(nextQuestion));
    }
  };

  return (
    <QuestionForm
      key={question.id}
      onResult={onResult}
      question={question}
      questionNumber={questionNumber}
    />
  );
};

export default DisplayQuestion;

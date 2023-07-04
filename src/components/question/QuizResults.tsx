import { QuestionType } from '@/schema/question.schema';

interface QuizResultsParams {
  questions: QuestionType[];
  answerSet: (boolean | null)[];
}

const QuizResults = ({ answerSet }: QuizResultsParams) => {
  const numberCorrect = answerSet.filter((answer) => answer === true).length;
  const percentage = 100 * (numberCorrect / answerSet.length);

  return (
    <>
      <h3>Result: {percentage.toFixed()}%</h3>
    </>
  );
};

export default QuizResults;

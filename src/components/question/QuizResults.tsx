import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

import Button from '@/components/buttons/Button';

import { QuestionType } from '@/schema/question.schema';

interface QuizResultsParams {
  questions: QuestionType[];
  answerSet: (boolean | null)[];
}

const QuizResults = ({ answerSet }: QuizResultsParams) => {
  const numberCorrect = answerSet.filter((answer) => answer === true).length;
  const questionsEncountered = answerSet.filter(
    (answer) => answer !== null
  ).length;
  const percentage = 100 * (numberCorrect / answerSet.length);

  return (
    <>
      <h2>Quiz Result: {percentage.toFixed()}%</h2>
      <div className='flex flex-col gap-3'>
        <ul role='list' className='mt-8 space-y-4'>
          <li className='flex gap-x-3'>
            <strong>Total Questions:</strong>
            <span>{questionsEncountered}</span>
          </li>
          <li className='flex gap-x-3'>
            <strong>Total Score:</strong> <span>{numberCorrect * 5}</span>
          </li>
          <li className='flex gap-x-3'>
            <strong>Correct Answers:</strong> <span>{numberCorrect}</span>
          </li>
          <li className='flex gap-x-3'>
            <strong>Wrong Answers:</strong>{' '}
            <span>{questionsEncountered - numberCorrect}</span>
          </li>
        </ul>
        <Link href='/assessments'>
          <Button variant='primary' leftIcon={FaArrowLeft}>
            Back to Assessments
          </Button>
        </Link>
      </div>
    </>
  );
};

export default QuizResults;

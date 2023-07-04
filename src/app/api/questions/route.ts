import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { Question } from '@/models/questions';
import { QuestionType } from '@/schema/question.schema';

export async function GET(request: NextRequest) {
  const querySearchParams = await request.nextUrl.searchParams;
  const { domains } = Object.fromEntries(querySearchParams);

  if (!process.env.MONGODB_URI) {
    throw new Error('Could not find mongodb uri');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const questionSet = await Question.aggregate([
      {
        $match: {
          domain: { $in: domains },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    //const rawdata = await readFile("./src/data/reactjs.json", "utf8");
    //const data = JSON.parse(rawdata);

    //const questionSet: QuestionJsonType[] = sampleSize(data, 10);

    const questions: QuestionType[] = [];

    questionSet.forEach((question, index) => {
      console.log(question);
      questions.push({
        id: Number(index) + 1,
        question: question.question,
        content: question.content,
        answers: question.answers || [],
        answerInfo: question.postAnswerText,
        correctAnswer: question.correctAnswer || -1,
        uniqueHash: '',
        domain: question.domain,
        questionType: 'multiple-choice',
      });
    });

    /*let questions: QuestionType[] = [
    {
      id: 1,
      question: "How many ducks (D D D) ?",
      answers: ["5", "3", "2"],
      correctAnswer: 3,
    },
  ];*/

    await mongoose.disconnect();

    //res.status(200).json({ questions });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

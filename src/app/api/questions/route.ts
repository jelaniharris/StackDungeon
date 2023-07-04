import mongoose, { PipelineStage } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import querystring from 'node:querystring';

import { Question } from '@/models/questions';
import { QuestionType } from '@/schema/question.schema';

export async function GET(request: NextRequest) {
  const querySearchParams = await request.nextUrl.searchParams;

  const parsedJSON = querystring.parse(querySearchParams.toString());

  const { domains, numberOfQuestions } = parsedJSON;

  console.log('querySearchParams are: ', querySearchParams);
  console.log('parsed json ', parsedJSON);
  console.log('Domains are: ', domains);

  if (!process.env.MONGODB_URI) {
    throw new Error('Could not find mongodb uri');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    //FilterQuery<any>
    let match: PipelineStage.Match = {
      $match: {
        domain: { $in: domains },
      },
    };

    if (!Array.isArray(domains) && domains !== undefined) {
      match = {
        $match: {
          domain: domains,
        },
      };
    }

    const questionSet = await Question.aggregate([
      match,
      {
        $sample: {
          size:
            numberOfQuestions && !Array.isArray(numberOfQuestions)
              ? parseInt(numberOfQuestions, 10)
              : 10,
        },
      },
    ]);

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

    await mongoose.disconnect();

    return NextResponse.json({ questions });
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}

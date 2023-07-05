import mongoose, { model, Schema } from 'mongoose';

import { QuestionSourceType, QuestionType } from '../schema/question.schema';

export const QuestionSourceSchema = new Schema<QuestionSourceType>(
  {
    url: { type: String, required: true },
    questionNumber: Number,
  },
  { _id: false }
);

export const QuestionSchema = new Schema<QuestionType>({
  uniqueHash: { type: String, index: true },
  question: { type: String, required: true },
  content: String,
  domain: { type: String, index: true, required: true },
  questionType: { type: String, required: true },
  source: QuestionSourceSchema,
  answerInfo: String,
  answers: { type: [String], required: true },
  correctAnswers: {
    type: [Number],
    required: true,
    validate: [
      (values: number[]) => {
        if (values.length == 0) return false;
        return values.every((value) => value >= 0 || value <= 10);
      },
      'Greater or equal to 0, but less than or equal to 10',
    ],
  },
});

export const Question =
  mongoose.models.question || model('question', QuestionSchema);

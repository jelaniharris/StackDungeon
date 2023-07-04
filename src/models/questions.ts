import mongoose, { model, Schema } from 'mongoose';

import { QuestionType } from '../schema/question.schema';

export const QuestionSchema = new Schema<QuestionType>({
  uniqueHash: String,
  question: { type: String, required: true },
  content: String,
  domain: String,
  questionType: String,
  source: String,
  answers: [String],
  correctAnswer: { type: Number, required: true, min: 0, max: 10 },
});

export const Question =
  mongoose.models.question || model('question', QuestionSchema);

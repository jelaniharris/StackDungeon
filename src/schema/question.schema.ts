export type QuestionType = {
  id?: number;
  question: string;
  uniqueHash: string;
  content?: string;
  answers: string[];
  domain: string;
  questionType: string;
  answerInfo?: string;
  source?: string;
  correctAnswer: number;
};

export type GetQuestions = {
  questions: QuestionType[];
};

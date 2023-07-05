export type QuestionSourceType = {
  url: string;
  questionNumber?: number;
};

export type QuestionType = {
  id?: number;
  question: string;
  uniqueHash: string;
  content?: string;
  answers: string[];
  domain: string;
  grouping?: string;
  questionType: string;
  answerInfo?: string;
  source?: QuestionSourceType;
  correctAnswers: number[];
};

export type GetQuestions = {
  questions: QuestionType[];
};

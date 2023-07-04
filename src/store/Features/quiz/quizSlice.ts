'use client';

import { createSlice } from '@reduxjs/toolkit';

import { QuestionType } from '@/schema/question.schema';

export type Quiz = {
  questions: QuestionType[];
  answerSet: (boolean | null)[];
  currentQuestion: number;
  reviewMode: boolean;
};

const initialState = {
  questions: [],
  answerSet: [],
  currentQuestion: 0,
  reviewMode: false,
} as Quiz;

export const quizSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload.questions;
    },
    resetAnswerSet: (state) => {
      const emptyAnswers: Array<boolean | null> = [];
      for (let k = 0; k < state.questions.length; k++) {
        emptyAnswers.push(null);
      }
      state.answerSet = emptyAnswers;
    },
    assignAnswer: (state, action) => {
      state.answerSet[action.payload.questionNumber] =
        action.payload.questionResult;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setReviewMode: (state, action) => {
      state.reviewMode = action.payload;
    },
  },
});

export default quizSlice.reducer;

export const quizAction = quizSlice.actions;

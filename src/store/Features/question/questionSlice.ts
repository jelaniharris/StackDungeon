'use client';

import { createSlice } from '@reduxjs/toolkit';

export const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    questions: [],
  },
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload.questions;
    },
  },
});

export default questionSlice.reducer;

export const questionAction = questionSlice.actions;

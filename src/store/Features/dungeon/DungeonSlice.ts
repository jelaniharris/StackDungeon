'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DifficultyReasonType = {
  reason: string;
  amount: number;
};

export type Dungeon = {
  name: string;
  hasTimer: boolean;
  timePerQuestion?: number;
  difficulty: number;
  numberOfQuestions: number;
  difficultyReasons: DifficultyReasonType[];
  domains: string[];
};

const initialState = {
  dungeon: {
    name: 'Unknown',
    hasTimer: false,
    timePerQuestion: 90,
    difficulty: 1,
    numberOfQuestions: 0,
  } as Dungeon,
};

export const dungeonSlice = createSlice({
  name: 'dungeon',
  initialState,
  reducers: {
    setDungeon: (state, action: PayloadAction<Dungeon>) => {
      state.dungeon = action.payload;
    },
  },
});

export default dungeonSlice.reducer;

export const dungeonAction = dungeonSlice.actions;

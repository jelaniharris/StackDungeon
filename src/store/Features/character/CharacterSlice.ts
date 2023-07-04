'use client';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Character = {
  domains: string[];
  gold: number;
  maxHealth: number;
  currentHealth: number;
  brokenHealth: number;
};

const initialState = {
  domains: [],
  gold: 0,
  maxHealth: 10,
  currentHealth: 10,
  brokenHealth: 0,
} as Character;

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    addDomain: (state, action: PayloadAction<string>) => {
      state.domains.push(action.payload);
    },
    removeDomain: (state, action: PayloadAction<string>) => {
      state.domains = state.domains.filter((item) => item !== action.payload);
    },
    addGold: (state, action) => {
      state.gold += action.payload.gold;
    },
  },
});

export default characterSlice.reducer;

export const characterAction = characterSlice.actions;

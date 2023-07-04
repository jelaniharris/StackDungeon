'use client';

import { createSlice } from '@reduxjs/toolkit';

export const questSlice = createSlice({
  name: 'quest',
  initialState: {
    currentFloor: 2,
  },
  reducers: {
    increaseFloor: (state) => {
      state.currentFloor += 1;
    },
  },
});

export default questSlice.reducer;

export const questAction = questSlice.actions;

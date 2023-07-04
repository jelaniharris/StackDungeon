'use client';

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import characterReducer from '@/store/Features/character/CharacterSlice';
import dungeonReducer from '@/store/Features/dungeon/DungeonSlice';
import questReducer from '@/store/Features/quest/QuestSlice';
import questionReducer from '@/store/Features/question/questionSlice';

export const store = configureStore({
  reducer: {
    questions: questionReducer,
    quest: questReducer,
    dungeon: dungeonReducer,
    character: characterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

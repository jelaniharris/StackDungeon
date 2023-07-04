'use client';

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import characterReducer from '@/store/Features/character/CharacterSlice';
import dungeonReducer from '@/store/Features/dungeon/DungeonSlice';
import questReducer from '@/store/Features/quest/QuestSlice';
import quizReducer from '@/store/Features/quiz/quizSlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    quest: questReducer,
    dungeon: dungeonReducer,
    character: characterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

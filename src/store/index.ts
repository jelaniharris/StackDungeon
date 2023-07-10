'use client';

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import characterReducer from '@/store/Features/character/CharacterSlice';
import dungeonReducer from '@/store/Features/dungeon/DungeonSlice';
import questReducer from '@/store/Features/quest/QuestSlice';
import quizReducer from '@/store/Features/quiz/quizSlice';

import { loadState } from '@/app/browser-storage';

const persistConfig = {
  key: 'root',
  storage: storage,
  blacklist: [''],
};

export const rootReducers = combineReducers({
  quiz: quizReducer,
  quest: questReducer,
  dungeon: dungeonReducer,
  character: characterReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

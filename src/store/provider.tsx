'use client';

import { debounce } from 'lodash';
import React from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store';

import { saveState } from '@/app/browser-storage';

store.subscribe(
  debounce(() => {
    saveState(store.getState());
  }, 800)
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

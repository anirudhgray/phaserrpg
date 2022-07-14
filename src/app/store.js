import { configureStore } from '@reduxjs/toolkit';
import initialReducer from './slices/initialSlice'

export const store = configureStore({
  reducer: {
    initial: initialReducer
  },
});

import { configureStore } from '@reduxjs/toolkit';
import initialReducer from './slices/initialSlice'
import videoPositionReducer from './slices/videoPositionSlice'

export const store = configureStore({
  reducer: {
    initial: initialReducer,
    videoPosition: videoPositionReducer
  },
});

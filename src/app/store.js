import { configureStore } from '@reduxjs/toolkit';
import initialReducer from './slices/initialSlice'
import videoPositionReducer from './slices/videoPositionSlice'
import proximityMuteSlice from './slices/proximityMuteSlice';

export const store = configureStore({
  reducer: {
    initial: initialReducer,
    videoPosition: videoPositionReducer,
    proximityMute: proximityMuteSlice
  },
});

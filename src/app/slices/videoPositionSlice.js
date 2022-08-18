import { createSlice } from '@reduxjs/toolkit'

export const videoPositionSlice = createSlice({
  name: 'videoPosition',
  initialState: {
    positions:{}
  },
  reducers: {
    setVideo: (state, action) => {
      state.positions[action.payload.uid] = action.payload.position
    },
    removeVideo: (state, action) => {
      delete state.positions[action.payload.uid]
    }
  }
})

export const { setVideo, removeVideo } = videoPositionSlice.actions

export default videoPositionSlice.reducer

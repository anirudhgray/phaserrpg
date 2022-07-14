import { createSlice } from '@reduxjs/toolkit'

export const initialSlice = createSlice({
  name: 'initial',
  initialState: {
    charName: '',
    roomName: '',
  },
  reducers: {
    setName: (state, action) => {
      state.charName = action.payload.charName
    },
    setRoom: (state, action) => {
      state.roomName = action.payload.roomName
    }
  }
})

export const { setName, setRoom } = initialSlice.actions

export default initialSlice.reducer

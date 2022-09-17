import { createSlice } from '@reduxjs/toolkit'

export const proximityMuteSlice = createSlice({
  name: 'proximityMute',
  initialState: {
    players: {}
  },
  reducers: {
    addProximalPlayer: (state, action) => {
      state.players[action.payload.player.playerId] = action.payload.player
    },
    removeProximalPlayer: (state, action) => {
      delete state.players[action.payload.player.playerId]
    }
  }
})

export const { addProximalPlayer, removeProximalPlayer } = proximityMuteSlice.actions

export default proximityMuteSlice.reducer

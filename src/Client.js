import {io} from 'socket.io-client'
export const ENDPOINT = 'https://phaserrpg-server.herokuapp.com/'

export const socket = io(ENDPOINT, {forceNew: true})

export var Client = {
  askNewPlayer: () => {
    socket.emit('newplayer')
    // emit to server
  }
}

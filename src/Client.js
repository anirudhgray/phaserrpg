import {io} from 'socket.io-client'
const ENDPOINT = 'http://localhost:8081'

export const socket = io(ENDPOINT, {forceNew: true})

export var Client = {
  askNewPlayer: () => {
    socket.emit('newplayer')
    // emit to server
  }
}

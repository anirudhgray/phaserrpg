import socketIOClient from 'socket.io-client'
const ENDPOINT = 'http://localhost:8081'

const socket = socketIOClient(ENDPOINT)
socket.on('connected',
  () => {
    console.log('connection')
  })

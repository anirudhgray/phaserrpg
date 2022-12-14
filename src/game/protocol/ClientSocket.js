import {io} from 'socket.io-client'

export default class ClientSocket {
  _id;
  constructor() {
    const server = 'https://phaserrpg-server-production.up.railway.app/';
    // const server = 'http://127.0.0.1:8081'
    const connOptions = {
      forceNew: true
    };

    this.socket = io(server, connOptions)
    this.socket.on('connect', () => {
      this._id = this.socket.id
    })
  }

  emit(event, args) {
    this.socket.emit(event, args)
  }

  init(handlers) {

    Object.keys(handlers).forEach(h => {
      this.socket.on(h, (args) => {
        handlers[h](args);
      });
    });

  }
}

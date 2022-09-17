import Phaser from 'phaser'

import { store } from '../../app/store'
import { setVideo } from '../../app/slices/videoPositionSlice';

import * as utilFunctions from '../utilFunctions'

import ClientSocket from '../protocol/ClientSocket';
import ClientPlayer from '../model/ClientPlayer';

// assets
import cloudCityJSON from '../assets/cloud_city.json'
import cloudCityTilesetImage from '../assets/cloud_tileset.png'
import charactersImages from '../assets/characters.png'
import { addProximalPlayer, removeProximalPlayer } from '../../app/slices/proximityMuteSlice';

import {checkProximityMute} from '../protocol/AgoraSetup.js'

class Play extends Phaser.Scene {

  constructor() {
    super({key: 'Play'})
  }

  removePlayer(playerId) {
    this.players.getChildren().forEach((player) => {
      if (playerId === player.playerId) {
        player.destroy();
      }
    });
    this.gridEngine.removeCharacter(playerId)
  }

  displayPlayer(playerInfo) {
    const player = new ClientPlayer(this, playerInfo.x, playerInfo.y, playerInfo.playerId, playerInfo.playerName, playerInfo.avatar, this.gridEngine, this.socket, store.getState().initial.roomName)
    this.players.add(player)
  }

  initPlayers(players) {
    Object.keys(players).forEach((id) => {
      this.displayPlayer(players[id]);
    });
  }

  // direction updates
  async updatePlayers(data) {
    const allPlayers = data.allPlayers
    const player = data.player
    const position = data.position
    // const direction = data.direction
    if (player.playerId !== this.socket._id) {
      console.log(Math.abs(position.x - this.gridEngine.getPosition(this.socket._id).x)+", "+Math.abs(position.y - this.gridEngine.getPosition(this.socket._id).y))
      this.gridEngine.moveTo(player.playerId,position)
      if (document.getElementById('video'+player.playerId)) {
        if (Math.abs(position.x - this.gridEngine.getPosition(this.socket._id).x) <= 2 && Math.abs(position.y - this.gridEngine.getPosition(this.socket._id).y) <= 2) {
          store.dispatch(addProximalPlayer({player:player}))
          checkProximityMute(player.playerId, true)
          document.getElementById('video'+player.playerId).style.display = 'block'
          document.getElementById('remote'+player.playerId).style.display = 'block'
        } else  {
          store.dispatch(addProximalPlayer({player:player}))
          checkProximityMute(player.playerId, false)
          document.getElementById('video'+player.playerId).style.display = 'none'
          document.getElementById('remote'+player.playerId).style.display = 'none'
        }
      }
      // const movement = await this.gridEngine.move(player.playerId, direction)
      // if (movement && (this.gridEngine.getPosition(player.playerId).x !== position.x || this.gridEngine.getPosition(player.playerId).y !== position.y)) this.gridEngine.moveTo(player.playerId,position)
    } 
    else if (player.playerId === this.socket._id) {
      Object.values(allPlayers).forEach(p => {
        if (p.playerId !== this.socket._id && document.getElementById('video'+p.playerId)) {
          if (Math.abs(p.x - this.gridEngine.getPosition(this.socket._id).x) <= 2 && Math.abs(p.y - this.gridEngine.getPosition(this.socket._id).y) <= 2) {
            store.dispatch(addProximalPlayer({player:p}))
            checkProximityMute(p.playerId, true)
            document.getElementById('video'+p.playerId).style.display = 'block'
            document.getElementById('remote'+p.playerId).style.display = 'block'
          } else  {
            store.dispatch(removeProximalPlayer({player:p}))
            checkProximityMute(p.playerId, false)
            document.getElementById('video'+p.playerId).style.display = 'none'
            document.getElementById('remote'+p.playerId).style.display = 'none'
          }
        }
      })
    }
    else if (position.x !== this.gridEngine.getPosition(this.socket._id).x || position.y !== this.gridEngine.getPosition(this.socket._id).y) {
      this.socket.emit('fixPosition', this.gridEngine.getPosition(this.socket._id))
    }
    console.log(`${player.playerId} moved to ${position.x},${position.y}`)
    store.dispatch(setVideo({uid: this.socket._id,position: {x:this.gridEngine.getPosition(this.socket._id).x, y:this.gridEngine.getPosition(this.socket._id).y}}))
  }

  enforcePositions(players) {
    console.log('player positions received')
    console.log(players)
    this.gridEngine.getAllCharacters().forEach((playerId) => {
      // this.gridEngine.stopMovement(playerId)
      if (playerId !== this.socket._id) {
        this.gridEngine.setPosition(playerId, {
          x:players[playerId].x-1,
          y:players[playerId].y
        })
        this.gridEngine.moveTo(playerId, {
          x:players[playerId].x,
          y:players[playerId].y
        })
      }
    })
  }

  preload () {
    this.load.spritesheet('player', charactersImages, {
      frameWidth: 26,
      frameHeight: 36
    })
    this.load.image('tiles', cloudCityTilesetImage)
    this.load.tilemapTiledJSON('cloud-city-map', cloudCityJSON)
  }

  create() {
    this.players = this.add.group();
    this.socket = new ClientSocket();
    this.socket.init(this.createHandlers());
    this.socket.emit('room', {roomName:store.getState().initial.roomName})

    // tilemap construction
    var cloudCityTilemap = this.make.tilemap({ key: 'cloud-city-map' })
    cloudCityTilemap.addTilesetImage('Cloud City', 'tiles')
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap
        .createLayer(i, 'Cloud City', 0, 0)
      layer.scale = 3
    }

    var gridEngineConfig = {
      characters: [],
      numberOfDirections: 8
    }
    this.gridEngine.create(cloudCityTilemap, gridEngineConfig)

    this.socket.emit('newJoin', {
      name: store.getState().initial.charName,
      data: localStorage.getItem('playerId')
    })

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.socket.emit('getPlayers')
      }
    })
  }

  // socket.on handlers
  createHandlers() {
    const handlers = [];
    handlers['newPlayerConnected'] = this.displayPlayer.bind(this);
    handlers['initialiseConnection'] = this.initPlayers.bind(this)
    handlers['playerDisconnected'] = this.removePlayer.bind(this)
    handlers['playerMove'] = this.updatePlayers.bind(this)
    handlers['positions'] = this.enforcePositions.bind(this)
    return handlers;
  }

  update = () => {
    utilFunctions.update(this)
  }
}

export default Play

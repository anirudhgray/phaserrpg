import Phaser from 'phaser'

import { store } from '../../app/store'

import * as utilFunctions from '../utilFunctions'

import ClientSocket from '../protocol/ClientSocket';
import ClientPlayer from '../model/ClientPlayer';

// assets
import cloudCityJSON from '../assets/cloud_city.json'
import cloudCityTilesetImage from '../assets/cloud_tileset.png'
import charactersImages from '../assets/characters.png'

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
    const player = new ClientPlayer(this, playerInfo.x, playerInfo.y, playerInfo.playerId, playerInfo.playerName, playerInfo.avatar, this.gridEngine, this.socket)
    this.players.add(player)
  }

  initPlayers(players) {
    Object.keys(players).forEach((id) => {
      this.displayPlayer(players[id]);
    });
  }

  // direction updates
  updatePlayers(data) {
    const player = data.player
    const position = data.position
    if (player.playerId !== this.socket._id) {
      this.gridEngine.moveTo(player.playerId,position)
    } 
    else if (position.x !== this.gridEngine.getPosition(this.socket._id).x || position.y !== this.gridEngine.getPosition(this.socket._id).y) {
      this.socket.emit('fixPosition', this.gridEngine.getPosition(this.socket._id))
    }
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
      name: store.getState().initial.charName
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

  update = () => utilFunctions.update(this)
}

export default Play

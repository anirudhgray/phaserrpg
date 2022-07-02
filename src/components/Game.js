import React, { useEffect } from 'react'
import * as Phaser from 'phaser'
import { GridEngine } from 'grid-engine'
import cloudCityJSON from '../assets/cloud_city.json'
import cloudCityTilesetImage from '../assets/cloud_tileset.png'
import charactersImages from '../assets/characters.png'
import '../Client'
import { Client, socket } from '../Client'

function preload () {
  this.load.spritesheet('player', charactersImages, {
    frameWidth: 26,
    frameHeight: 36
  })
  this.load.image('tiles', cloudCityTilesetImage)
  this.load.tilemapTiledJSON('cloud-city-map', cloudCityJSON)
}

function create () {
  var cloudCityTilemap = this.make.tilemap({ key: 'cloud-city-map' })
  cloudCityTilemap.addTilesetImage('Cloud City', 'tiles')
  for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
    const layer = cloudCityTilemap
      .createLayer(i, 'Cloud City', 0, 0)
    layer.scale = 3
  }

  const self = this
  Client.askNewPlayer();
  socket.on('newPlayer', (newPlayerData) => {
    console.log(newPlayerData)
    let data = newPlayerData.data
    var players = newPlayerData.players
    console.log("another one")
    
    var cloudCityTilemap = this.make.tilemap({ key: 'cloud-city-map' })
    cloudCityTilemap.addTilesetImage('Cloud City', 'tiles')
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap
        .createLayer(i, 'Cloud City', 0, 0)
      layer.scale = 3
    }

    let newPlayerSprite = this.add.sprite(0,0,'player')
    newPlayerSprite.scale = 3
    newPlayerSprite.setDepth(2)
    gridEngineConfig.characters.push({
      id:`player${data.id}`,
      sprite: newPlayerSprite,
      walkingAnimationMapping: data.avatar,
      startPosition: {
        x: data.x,
        y: data.y
      }
    })

    gridEngineConfig.characters.forEach((char) => {
      if (char.id === 'player') {
        console.log("hit player")
        char.startPosition = {
          x: players[socket.id].x,
          y: players[socket.id].y
        }
      } else {
        console.log("hit else")
        console.log(char.id.slice(6))
        char.startPosition = {
          x: players[char.id.slice(6)].x,
          y: players[char.id.slice(6)].y
        }
      }
    })

    this.gridEngine.create(cloudCityTilemap, gridEngineConfig)

    socket.on('playerDisconnect', 
    (disconplayerid) => {
      console.log("disocn")
      console.log(disconplayerid)
      if (disconplayerid === data.id) {
        console.log("someone left")
        gridEngineConfig.characters = gridEngineConfig.characters.filter(
          (char) => {
            return char.id !== `player${data.id}`
          }
        )
        newPlayerSprite.destroy()
      }
    })

  })

  socket.on('currentPlayers', (players) =>{
    console.log("welcome")
    Object.keys(players).forEach(function (id) {
      if (players[id].id === socket.id) {
        
        var cloudCityTilemap = self.make.tilemap({ key: 'cloud-city-map' })
        cloudCityTilemap.addTilesetImage('Cloud City', 'tiles')
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
          const layer = cloudCityTilemap
            .createLayer(i, 'Cloud City', 0, 0)
          layer.scale = 3
        }

        let playerSprite = self.add.sprite(0, 0, 'player')
        playerSprite.scale = 3
        playerSprite.setDepth(-1)
      
        self.cameras.main.startFollow(playerSprite)
        self.cameras.main.roundPixels = true
        self.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height * 2)

        gridEngineConfig.characters.push(
          {
            id:'player',
            sprite: playerSprite,
            walkingAnimationMapping: players[id].avatar,
            startPosition: {
              x: players[id].x,
              y: players[id].y
            }
          }
        )
        self.gridEngine.create(cloudCityTilemap, gridEngineConfig)

        self.gridEngine.positionChangeFinished().subscribe(
          ({ charId, exitTile, enterTile }) => {
            socket.emit('newpos', {char:charId,x:enterTile.x, y:enterTile.y})
          }
        )
      } else {
        var cloudCityTilemap = self.make.tilemap({ key: 'cloud-city-map' })
        cloudCityTilemap.addTilesetImage('Cloud City', 'tiles')
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
          const layer = cloudCityTilemap
            .createLayer(i, 'Cloud City', 0, 0)
          layer.scale = 3
        }
        let newPlayerSprite = self.add.sprite(0,0,'player')
        newPlayerSprite.setDepth(2)
        newPlayerSprite.scale = 3
        gridEngineConfig.characters.push({
          id:`player${players[id].id}`,
          sprite: newPlayerSprite,
          walkingAnimationMapping: players[id].avatar,
          startPosition: {
            x: players[id].x,
            y: players[id].y
          }
        })
        self.gridEngine.create(cloudCityTilemap, gridEngineConfig)

        socket.on('playerDisconnect', 
        (disconplayerid) => {
          console.log("disocn")
          console.log(disconplayerid)
          if (disconplayerid === players[id].id) {
            console.log("someone left")
            gridEngineConfig.characters = gridEngineConfig.characters.filter(
              (char) => {
                return char.id !== `player${players[id].id}`
              }
            )
            newPlayerSprite.destroy()
          }
        })
      }
    });
  })
  socket.on('playerMove', (movingplayer) => {
    if (movingplayer.playerid !== socket.id) {
      self.gridEngine.move(`player${movingplayer.playerid}`, movingplayer.direction)
    }
  })

  var gridEngineConfig = {
    characters: [
    ],
    numberOfDirections: 8
  }

  this.gridEngine.create(cloudCityTilemap, gridEngineConfig)
}

function update () {
  const cursors = this.input.keyboard.createCursorKeys()
  if (cursors.left.isDown && cursors.up.isDown) {
    this.gridEngine.move('player', 'up-left')
    socket.emit('playerMove', 'up-left')
  } else if (cursors.left.isDown && cursors.down.isDown) {
    this.gridEngine.move('player', 'down-left')
    socket.emit('playerMove', 'down-left')
  } else if (cursors.right.isDown && cursors.up.isDown) {
    this.gridEngine.move('player', 'up-right')
    socket.emit('playerMove', 'up-right')
  } else if (cursors.right.isDown && cursors.down.isDown) {
    this.gridEngine.move('player', 'down-right')
    socket.emit('playerMove', 'down-right')
  } else if (cursors.left.isDown) {
    this.gridEngine.move('player', 'left')
    socket.emit('playerMove', 'left')
  } else if (cursors.right.isDown) {
    this.gridEngine.move('player', 'right')
    socket.emit('playerMove', 'right')
  } else if (cursors.up.isDown) {
    this.gridEngine.move('player', 'up')
    socket.emit('playerMove', 'up')
  } else if (cursors.down.isDown) {
    this.gridEngine.move('player', 'down')
    socket.emit('playerMove', 'down')
  }
}

const gameArea = new Phaser.Game({
    plugins: {
      scene: [
        {
          key: 'gridEngine',
          plugin: GridEngine,
          mapping: 'gridEngine'
        }
      ]
    },
    render: {
      antialias: false
    },
    type: Phaser.CANVAS,
    width: window.innerWidth,
    height: window.innerHeight,
    scene: {
      preload,
      create,
      update
    },
    parent: 'game',
    backgroundColor: '#48C4F8',
  })

window.addEventListener('resize', () => {
  gameArea.scale.resize(window.innerWidth, window.innerHeight)
})

export default function Game () {
  return (
    <div id='game' />
  )
}

import React from 'react'
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

    this.newPlayerSprite = this.add.sprite(0,0,'player')
    this.newPlayerSprite.scale = 3
    this.newPlayerSprite.setDepth(2)
    gridEngineConfig.characters.push({
      id:`player${data.id}`,
      sprite: this.newPlayerSprite,
      walkingAnimationMapping: data.avatar,
      startPosition: {
        x: data.x,
        y: data.y
      },
      speed: 4
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
        this.gridEngine.removeCharacter(`player${disconplayerid}`)
        this.newPlayerSprite.destroy()
      }
    })

    // self.gridEngine.positionChangeStarted().subscribe(
    //   ({ charId, exitTile, enterTile }) => {
    //     socket.emit('newpos', {char:charId,x:enterTile.x, y:enterTile.y})
    //   }
    // )

  })

  socket.on('currentPlayers', (players) =>{
    console.log("welcome"+socket.id)
    Object.keys(players).forEach(function (id) {
      if (players[id].id === socket.id) {
        
        var cloudCityTilemap = self.make.tilemap({ key: 'cloud-city-map' })
        cloudCityTilemap.addTilesetImage('Cloud City', 'tiles')
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
          const layer = cloudCityTilemap
            .createLayer(i, 'Cloud City', 0, 0)
          layer.scale = 3
        }

        self.playerSprite = self.add.sprite(0, 0, 'player')
        self.playerSprite.scale = 3
        self.playerSprite.setDepth(-1)
      
        self.cameras.main.startFollow(self.playerSprite)
        self.cameras.main.roundPixels = true
        self.cameras.main.setFollowOffset(-self.playerSprite.width, -self.playerSprite.height * 2)

        gridEngineConfig.characters.push(
          {
            id:'player',
            sprite: self.playerSprite,
            walkingAnimationMapping: players[id].avatar,
            startPosition: {
              x: players[id].x,
              y: players[id].y
            },
            speed: 4
          }
        )
        self.gridEngine.create(cloudCityTilemap, gridEngineConfig)

        // self.gridEngine.positionChangeStarted().subscribe(
        //   ({ charId, exitTile, enterTile }) => {
        //     socket.emit('newpos', {char:charId,x:enterTile.x, y:enterTile.y})
        //   }
        // )
      } else {
        var cloudCityTilemap = self.make.tilemap({ key: 'cloud-city-map' })
        cloudCityTilemap.addTilesetImage('Cloud City', 'tiles')
        for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
          const layer = cloudCityTilemap
            .createLayer(i, 'Cloud City', 0, 0)
          layer.scale = 3
        }
        self.newPlayerSprite = self.add.sprite(0,0,'player')
        self.newPlayerSprite.setDepth(2)
        self.newPlayerSprite.scale = 3
        gridEngineConfig.characters.push({
          id:`player${players[id].id}`,
          sprite: self.newPlayerSprite,
          walkingAnimationMapping: players[id].avatar,
          startPosition: {
            x: players[id].x,
            y: players[id].y
          },
          speed:4
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
            self.newPlayerSprite.destroy()
          }
        })
      }
    });
  })
  socket.on('playerMove', (movingplayer) => {
    if (movingplayer.playerid !== socket.id) {
      console.log(`moving ${movingplayer.playerid} to ${movingplayer.position.x}, ${movingplayer.position.y}`)

      console.log(`at ${self.gridEngine.getPosition(`player${movingplayer.playerid}`).x},${self.gridEngine.getPosition(`player${movingplayer.playerid}`).y}`)

      console.log(movingplayer.direction)

      if (self.gridEngine.getPosition(`player${movingplayer.playerid}`).x + movingplayer.offsets.x === movingplayer.position.x && self.gridEngine.getPosition(`player${movingplayer.playerid}`).y + movingplayer.offsets.y === movingplayer.position.y) {
        console.log("going good")
        self.gridEngine.move(`player${movingplayer.playerid}`, movingplayer.direction)
      } else {
        self.gridEngine.moveTo(`player${movingplayer.playerid}`, movingplayer.position)
      }
    }
  })

  var gridEngineConfig = {
    characters: [
    ],
    numberOfDirections: 8
  }

  this.gridEngine.create(cloudCityTilemap, gridEngineConfig)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      socket.emit('getPlayers')
      socket.on('positions', (players) => {
        console.log('player positions received')
        console.log(players)
        gridEngineConfig.characters.forEach((char) => {
          if (char.id !== 'player') {
            console.log("shifting char" + char.id + "to " + players[char.id.slice(6)].x + " " +players[char.id.slice(6)].y)
            this.gridEngine.setPosition(char.id, {
              x:players[char.id.slice(6)].x-1,
              y:players[char.id.slice(6)].y
            })
            this.gridEngine.moveTo(char.id, {
              x:players[char.id.slice(6)].x,
              y:players[char.id.slice(6)].y
            })
          }
        })
      })
    }
  })
}

function update () {

  const cursors = this.input.keyboard.createCursorKeys()
  if (cursors.left.isDown && cursors.up.isDown) {
    let position = this.gridEngine.getPosition('player')
    position.x--;
    position.y--;
    this.gridEngine.move('player', 'up-left')
    socket.emit('playerMove', {direction:'up-left', offsets: {x:-1, y:-1}, position})
  } else if (cursors.left.isDown && cursors.down.isDown) {
    let position = this.gridEngine.getPosition('player')
    position.x--;
    position.y++;
    this.gridEngine.move('player', 'down-left')
    socket.emit('playerMove', {direction:'down-left', offsets: {x:-1, y:1},position})
  } else if (cursors.right.isDown && cursors.up.isDown) {
    let position = this.gridEngine.getPosition('player')
    position.x++;
    position.y--;
    this.gridEngine.move('player', 'up-right')
    socket.emit('playerMove', {direction:'up-right',offsets: {x:1, y:-1}, position})
  } else if (cursors.right.isDown && cursors.down.isDown) {
    let position = this.gridEngine.getPosition('player')
    position.x++;
    position.y++;
    this.gridEngine.move('player', 'down-right')
    socket.emit('playerMove', {direction:'down-right',offsets: {x:1, y:1}, position})
  } else if (cursors.left.isDown) {
    let position = this.gridEngine.getPosition('player')
    position.x--;
    this.gridEngine.move('player', 'left')
    socket.emit('playerMove', {direction:'left',offsets: {x:-1, y:0}, position})
  } else if (cursors.right.isDown) {
    let position = this.gridEngine.getPosition('player')
    position.x++;
    this.gridEngine.move('player', 'right')
    socket.emit('playerMove', {direction:'right', offsets: {x:1, y:0},position})
  } else if (cursors.up.isDown) {
    let position = this.gridEngine.getPosition('player')
    position.y--;
    this.gridEngine.move('player', 'up')
    socket.emit('playerMove', {direction:'up', offsets: {x:0, y:-1}, position})
  } else if (cursors.down.isDown) {
    let position = this.gridEngine.getPosition('player')
    position.y++;
    this.gridEngine.move('player', 'down')
    socket.emit('playerMove', {direction:'down',offsets: {x:0, y:1}, position})
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
    type: Phaser.AUTO,
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

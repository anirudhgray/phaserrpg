import React from 'react'
import { useEffect } from 'react'
import * as Phaser from 'phaser'
import { GridEngine } from 'grid-engine'
import cloudCityJSON from '../assets/cloud_city.json'
import cloudCityTilesetImage from '../assets/cloud_tileset.png'
import charactersImages from '../assets/characters.png'

export default function Game() {
  function preload () {
    this.load.spritesheet("player", charactersImages, {
      frameWidth: 26,
      frameHeight: 36,
    });
    this.load.image("tiles", cloudCityTilesetImage);
    this.load.tilemapTiledJSON("cloud-city-map", cloudCityJSON);
  }

  function create () {
    const cloudCityTilemap = this.make.tilemap({ key: "cloud-city-map" });
    cloudCityTilemap.addTilesetImage("Cloud City", "tiles");
    for (let i = 0; i < cloudCityTilemap.layers.length; i++) {
      const layer = cloudCityTilemap
        .createLayer(i, "Cloud City", 0, 0)
      layer.setDepth(i);
      layer.scale = 3;
    }

    const playerSprite = this.add.sprite(0,0, "player");
    playerSprite.scale = 3;

    const npcSprite = this.add.sprite(0, 0, "player");
    npcSprite.scale = 3;

    this.cameras.main.startFollow(playerSprite);
    this.cameras.main.roundPixels = true;
    this.cameras.main.setFollowOffset(-playerSprite.width, -playerSprite.height)

    const gridEngineConfig = {
      characters: [
        {
          id: "player",
          sprite: playerSprite,
          walkingAnimationMapping: 6,
          startPosition: { x: 10, y: 10 },

        },
        {
          id: "npc0",
          sprite: npcSprite,
          walkingAnimationMapping: 0,
          startPosition: { x: 5, y: 5 },
          speed: 3,
        }
      ],
      numberOfDirections: 8,
    };
  
    this.gridEngine.create(cloudCityTilemap, gridEngineConfig);
  }

  function update () {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown && cursors.up.isDown) {
      this.gridEngine.move("player", "up-left");
    } else if (cursors.left.isDown && cursors.down.isDown) {
      this.gridEngine.move("player", "down-left");
    } else if (cursors.right.isDown && cursors.up.isDown) {
      this.gridEngine.move("player", "up-right");
    } else if (cursors.right.isDown && cursors.down.isDown) {
      this.gridEngine.move("player", "down-right");
    } else if (cursors.left.isDown) {
      this.gridEngine.move("player", "left");
    } else if (cursors.right.isDown) {
      this.gridEngine.move("player", "right");
    } else if (cursors.up.isDown) {
      this.gridEngine.move("player", "up");
    } else if (cursors.down.isDown) {
      this.gridEngine.move("player", "down");
    }
  
  }


  useEffect(() => {
    new Phaser.Game({
      plugins: {
        scene: [
          {
            key: "gridEngine",
            plugin: GridEngine,
            mapping: "gridEngine",
          },
        ]
      },    
      render: {
        antialias: false,
      },
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: {
          preload: preload,
          create: create,
          update: update
      },
      parent: 'game',
      backgroundColor: "#48C4F8"
    });
  }, [])

  return (
    <div id='game'></div>
  )
}

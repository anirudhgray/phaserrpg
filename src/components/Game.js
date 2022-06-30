import React from 'react'
import { useEffect } from 'react'
import * as Phaser from 'phaser'
import cloudCityJSON from '../assets/cloud_city.json'
import cloudCityTilesetImage from '../assets/cloud_tileset.png'

export default function Game() {
  function preload () {
    this.load.spritesheet("player", "assets/characters.png", {
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
  }

  function update () {
  }


  useEffect(() => {
    new Phaser.Game({
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

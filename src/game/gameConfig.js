import Phaser from 'phaser';
import {GridEngine} from 'grid-engine'

// scenes
import Play from './scenes/Play';

const config = {
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
  scene: [Play],
  scale: {
    parent:'game'
  },
  transparent: true,
  backgroundColor: '#48C4F8',
};

export default config;

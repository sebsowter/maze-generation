import 'phaser';
import GameScene from './scenes/GameScene';
import { GameConfigAttractors } from './types'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 256,
  height: 224,
  zoom: 3,
  input: {
    keyboard: true,
    mouse: false,
    touch: false,
    gamepad: false,
  },
  backgroundColor: "#342546",
  render: {
    pixelArt: true,
    antialias: false,
  },
  audio: {
    noAudio: false,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0.5,
      },
    },
  },
  scene: [
    GameScene,
  ],
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});

import 'phaser';
import Scene from './Scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 496,
  height: 496,
  zoom: 2,
  backgroundColor: "#342546",
  render: {
    pixelArt: true,
    antialias: false,
  },
  scene: Scene,
};

window.addEventListener('load', () => {
  const game = new Phaser.Game(config);
});

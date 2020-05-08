import 'phaser';
import Categories from './categories';
import { createArc } from '../utils';

const defaultVertices = [
  [216, 356],
  [144, 392],
  [144, 400],
  [240, 400],
  [240, 0],
  [0, 0],
  [0, 400],
  [76, 400],
  [76, 392],
  [4, 356],
];

const triangleLeft = {
  label: 'bumper',
  vertices: [
    [0, 40],
    ...createArc(4, 4, 4, 4, 8, 12, 4),
    ...createArc(18, 45, 4, 4, 8, 0, 3)
  ],
  color: 0xffff00,
  category: Categories.LEVEL_1,
  bounce: 1.5,
  friction: 0.5,
  position: new Phaser.Math.Vector2(80, 272 * 2),
  onCollide() {},
};

const triangleRight = {
  label: 'bumper',
  vertices: [
    [22, 40],
    ...createArc(4, 45, 4, 4, 8, 2, 3),
    ...createArc(18, 4, 4, 4, 8, 13, 4)
  ],
  color: 0xffff00,
  category: Categories.LEVEL_1,
  bounce: 1.5,
  friction: 0.5,
  position: new Phaser.Math.Vector2(158 * 2, 272 * 2),
  onCollide() {},
};

const railLeft = {
  vertices: [
    [0, 0],
    [0, 64],
    [38, 83],
    [43, 73],
    [4, 53],
    [4, 0]
  ],
  color: 0xff9900,
  category: Categories.LEVEL_1,
  bounce: 0,
  friction: 0,
  position: new Phaser.Math.Vector2(40, 272 * 2),
};

const railRight = {
  vertices: [
    [43, 0],
    [43, 64],
    [5, 83],
    [0, 73],
    [39, 53],
    [39, 0]
  ],
  color: 0xff9900,
  category: Categories.LEVEL_1,
  bounce: 0,
  friction: 0,
  position: new Phaser.Math.Vector2(314, 272 * 2),
};

export {
  defaultVertices,
  triangleLeft,
  triangleRight,
  railLeft,
  railRight,
};

import 'phaser';
import Categories from '../constants/categories'

function createArc(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  sides: integer,
  start: integer,
  steps: integer,
  anticlockwise?: boolean,
): object[] {
  const segment = (Math.PI * 2 / sides) * (anticlockwise ? -1 : 1);
  const arr = [];

  for (let i = start; i < start + steps; i++) {
    const radians = i * segment;
    const x = radiusX * Math.cos(radians) + centerX;
    const y = radiusY * Math.sin(radians) + centerY;

    arr.push([x, y]);
  }

  return arr;
}

function roundVertices(num: number): number {
  return Math.floor(num * 100) / 100;
}

function getBoundaryVertices(arr: object[], scale: number = 2): string {
  let str = '';

  arr.forEach((boundary: object, index: integer) => {
    const x = roundVertices(boundary[0] * scale);
    const y = roundVertices(boundary[1] * scale);
    const space = index < arr.length - 1 ? ' ' : '';
    
    str += `${x} ${y}${space}`;
  });

  return str;
}

function overlaps(bodyA, bodyB): boolean {
  return bodyA.x > bodyB.x - bodyB.width / 2
    && bodyA.x < bodyB.x + bodyB.width / 2
    && bodyA.y > bodyB.y - bodyB.height / 2
    && bodyA.y < bodyB.y + bodyB.height / 2;
}

function getDepth(category: number): number {
  return category === Categories.LEVEL_2
    || category === Categories.LEVEL_3 ? 4
    : category === Categories.LEVEL_4 ? 6 : 1;
}

function pointInDistance(angle: number, radius: number): Phaser.Math.Vector2 {    
  return new Phaser.Math.Vector2(
    radius * Math.cos(angle * (Math.PI / 180)),
    radius * Math.sin(angle * (Math.PI / 180))
  );
}

export {
  overlaps,
  createArc,
  roundVertices,
  pointInDistance,
  getBoundaryVertices,
  getDepth,
};

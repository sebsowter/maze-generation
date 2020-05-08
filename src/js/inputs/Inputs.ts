import { Keys } from '../types';

export default class {
  private keys: Keys;

  constructor(scene) {
    this.keys = scene.input.keyboard.addKeys('W,A,S,D,up,left,down,right,space');
  }

  public get isUp(): boolean {
    return this.keys.up.isDown || this.keys.W.isDown;
  }

  public get isDown(): boolean {
    return this.keys.down.isDown || this.keys.S.isDown;
  }

  public get isLeft(): boolean {
    return this.keys.left.isDown || this.keys.A.isDown;
  }

  public get isRight(): boolean {
    return this.keys.right.isDown || this.keys.D.isDown;
  }

  public get isSpace(): boolean {
    return this.keys.space.isDown;
  }

  public get isAny(): boolean {
    return Object.keys(this.keys).some(key => this.keys[key].isDown);
  }
}

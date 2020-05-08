import 'phaser';

export default class TableScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.DynamicTilemapLayer;
  private tiles: integer[] = [];
  private walls: integer[] = [];
  private maze: integer[] = [];
  private border: integer = 1;
  private cols: integer = Math.floor(496 / 16 - this.border * 2);
  private rows: integer = Math.floor(496 / 16 - this.border * 2);

  public preload() {
    this.load.image('tiles', './assets/tiles.png');
  }
  
  public create() {
    const tilemap = this.make.tilemap({
      key: 'map',
      tileWidth: 16,
      tileHeight: 16,
      width: 31,
      height: 31,
    });
    const tileset = tilemap.addTilesetImage('tileset', 'tiles', 16, 16);
    
    this.layer = tilemap.createBlankDynamicLayer('layer', tileset);

    for (let y = 0; y < this.rows + this.border * 2; y++) {
      for (let x = 0; x < this.cols + this.border * 2; x++) {
        this.layer.putTileAt(0, x, y);
      }
    }
    
    this.tiles = [];

    for (let i = 0; i < this.cols * this.rows; i++) {
      this.tiles.push(0);
    }

    this.addCellToMaze(Math.floor(Math.random() * this.tiles.length));

    setInterval(() => {
      if (this.walls.length) {
        this.step()
      }
    }, 50);
  }

  private step() {
    const index = this.walls[Math.floor(Math.random() * this.walls.length)];
    const adjacents = this.getAdjacent(index);
    const maze = [];

    adjacents.forEach((adjacent: integer, index: integer) => {
      if (this.tiles[adjacent] === 2) {
        maze.push(index);
      }
    });

    if (maze.length === 1) {
      this.setCell(index, 'corridor');

      const opposite = adjacents[Phaser.Math.Wrap(maze[0] + 2, 0, 4)];
    
      if (opposite) {
        this.addCellToMaze(opposite);
      }
    } else if (maze.length === 2) {
      this.setCell(index, 'brick');
    }
  }

  private addCellToMaze(index: integer) {
    this.setCell(index, 'maze');
    this.getAdjacent(index).forEach(cell => {
      if (cell !== null && this.tiles[cell] !== 3 && !this.walls.includes(cell)) {
        this.setCell(cell, 'wall');
      }
    });
  }

  private setCell(index: integer, type: string) {
    const position = this.getLayerPosition(index);

    let value = 1;

    switch (type) {
      case 'brick':
        value = 0;
        this.removeWall(index);
        break;
      case 'wall':
        value = 1;
        this.addWall(index);
        break;
      case 'maze':
        value = 2;
        this.addMaze(index);
        break;
      case 'corridor':
        value = 3;
        this.removeWall(index);
        break;
    }

    this.tiles[index] = value;
    this.layer.putTileAt(value, position.x, position.y);
  }

  private addMaze(index: integer) {
    if (!this.maze.includes(index)) {
      this.maze.push(index);
    }
  }

  private addWall(index: integer) {
    if (!this.walls.includes(index)) {
      this.walls.push(index);
    }
  }

  private removeWall(index: integer) {
    this.walls.splice(this.walls.indexOf(index), 1);
  }

  private getAdjacent(index: integer) {
    return [
      this.getAdjacentY(index, -1),
      this.getAdjacentX(index, 1),
      this.getAdjacentY(index, 1),
      this.getAdjacentX(index, -1),
    ];
  }

  private getAdjacentX(index: integer, direction: integer) {
    const adjacent = index % this.cols;

    if ((adjacent > 0 && direction < 0) || (adjacent < this.cols - 1 && direction > 0)) {    
      return index + direction;
    }
    
    return null;
  }

  private getAdjacentY(index: integer, direction: integer) {
    const adjacent = index + direction * this.cols;
    
    if (adjacent >= 0 && adjacent < this.tiles.length) {
      return adjacent;
    }
    
    return null;
  }

  private getLayerPosition(index: integer) {
    return new Phaser.Math.Vector2(
      index % this.cols + this.border,
      Math.floor(index / this.cols) + this.border,
    );
  }
}

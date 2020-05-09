import 'phaser';

const Tiles = {
  'wall': 0,
  'neighbour': 1,
  'maze': 2,
  'passage': 3,
};

export default class TableScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.DynamicTilemapLayer;
  private timer: Phaser.Time.TimerEvent;
  private tiles: integer[] = [];
  private walls: integer[] = [];
  private border: integer = 1;
  private cols: integer = 496 / 16 - this.border * 2;
  private rows: integer = 496 / 16 - this.border * 2;

  public preload() {
    this.load.image('tiles', './assets/tiles.png');
  }
  
  public init() {
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.tiles.push(Tiles.wall);
    }
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
        this.layer.putTileAt(Tiles.wall, x, y);
      }
    }

    const random = Math.floor(Math.random() * (this.tiles.length / 4));
    const index = (Math.floor(random / (this.cols / 2)) * 2 * this.cols) + ((random % Math.ceil(this.cols / 2)) * 2);

    this.addCellToMaze(index);

    this.timer = this.time.addEvent({
      delay: 50,
      loop: true,
      callbackScope: this,
      callback: function() {
        if (this.walls.length) {
          this.step();
        } else {
          this.timer.destroy();
        }
      },
    });
  }

  private step() {
    const index = this.walls[Math.floor(Math.random() * this.walls.length)];
    const neighbours = this.getAdjacent(index);
    const maze = [];

    neighbours.forEach((neighbour: integer, index: integer) => {
      if (this.tiles[neighbour] === Tiles.maze) {
        maze.push(index);
      }
    });

    if (maze.length === 1) {
      const neighbour = Phaser.Math.Wrap(maze[0] + 2, 0, 4);
      const opposite = neighbours[neighbour];

      this.setCell(index, Tiles.passage);
    
      if (opposite !== null) {
        this.addCellToMaze(opposite);
      }
    } else if (maze.length === 2) {
      this.setCell(index, Tiles.wall);
    }
  }

  private addCellToMaze(index: integer) {
    this.setCell(index, Tiles.maze);
    this.getAdjacent(index).forEach(cell => {
      if (cell !== null && this.tiles[cell] !== Tiles.passage) {
        this.setCell(cell, Tiles.neighbour);
      }
    });
  }

  private setCell(index: integer, type: integer) {
    const position = this.getLayerPosition(index);

    this.tiles[index] = type;
    this.layer.putTileAt(type, position.x, position.y);

    switch (type) {
      case Tiles.wall:
      case Tiles.passage:
        this.walls.splice(this.walls.indexOf(index), 1);
        break;
      case Tiles.neighbour:
        this.walls.push(index);
        break;
    }
  }

  private getAdjacent(index: integer): integer[] {
    return [
      this.getAdjacentY(index, -1),
      this.getAdjacentX(index, 1),
      this.getAdjacentY(index, 1),
      this.getAdjacentX(index, -1),
    ];
  }

  private getAdjacentX(index: integer, direction: integer): integer {
    const neighbour = index % this.cols;

    if ((neighbour > 0 && direction < 0) || (neighbour < this.cols - 1 && direction > 0)) {    
      return index + direction;
    }
    
    return null;
  }

  private getAdjacentY(index: integer, direction: integer): integer {
    const neighbour = index + direction * this.cols;
    
    if (neighbour >= 0 && neighbour < this.tiles.length) {
      return neighbour;
    }
    
    return null;
  }

  private getLayerPosition(index: integer): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      index % this.cols + this.border,
      Math.floor(index / this.cols) + this.border,
    );
  }
}

import 'phaser';
	
const enum Tiles {
  wall = 0,
  neighbour = 1,
  maze = 2,
  passage = 3,
}

export default class TableScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.DynamicTilemapLayer;
  private timer: Phaser.Time.TimerEvent;
  private tiles: object[] = [];
  private walls: integer[] = [];
  private border: integer = 1;
  private cols: integer = 31;
  private rows: integer = 31;

  public preload() {
    this.load.image('tiles', './assets/tiles.png');
  }
  
  public init() {
    this.tiles = [];

    for (let y = 0; y < this.rows; y++) {
      this.tiles[y] = [];

      for (let x = 0; x < this.cols; x++) {
        this.tiles[y][x] = Tiles.wall;
      }
    }
  }
  
  public create() {
    const tilemap = this.make.tilemap({
      key: 'map',
      tileWidth: 16,
      tileHeight: 16,
      width: this.cols,
      height: this.rows,
    });
    const tileset = tilemap.addTilesetImage('tileset', 'tiles', 16, 16);
    
    this.layer = tilemap.createBlankDynamicLayer('layer', tileset);

    for (let y = 0; y < this.rows + this.border * 2; y++) {
      for (let x = 0; x < this.cols + this.border * 2; x++) {
        this.layer.putTileAt(Tiles.wall, x, y);
      }
    }

    const randomX = Math.floor(Math.random() * this.rows);
    const randomY = Math.floor(Math.random() * this.cols);

    this.addCellToMaze(randomX, randomY);

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
    const cell = this.indexToCell(index);
    const neighbours = this.getAdjacent(cell);
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

  private addCellToMaze(x: integer, y: integer) {
    this.setCell(x, y, Tiles.maze);
    this.getAdjacent(index).forEach(cell => {
      if (cell !== null && this.tiles[cell] !== Tiles.passage) {
        this.setCell(cell, Tiles.neighbour);
      }
    });
  }

  private setCell(x: integer, y: integer, type: integer) {
    const index = this.cellToIndex(x, y);

    this.tiles[x][y] = type;
    this.layer.putTileAt(type, x + 1, y + 1);

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

  private getAdjacent(x: integer, y: integer): integer[] {
    return [
      this.getAdjacentY(x, y, -1),
      this.getAdjacentX(x, this.cols, 1),
      this.getAdjacentY(x, y, 1),
      this.getAdjacentX(x, this.cols, -1),
    ];
  }

  private getAdjacentX(x: integer, max: integer, direction: integer): integer {
    const neighbour = x + direction;

    if (neighbour > 0 && neighbour < max) {    
      return neighbour;
    }
    
    return null;
  }

  private getAdjacentY(x: integer, y: integer, max: integer, direction: integer): integer {
    const neighbour = index + direction * this.cols;
    
    if (neighbour >= 0 && neighbour < this.tiles.length) {
      return neighbour;
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

  private cellToIndex(x: integer, y: integer): integer {
    return y * this.cols + x;
  }

  private indexToCell(index: integer): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(
      index % this.cols,
      Math.floor(index / this.cols),
    );
  }
}

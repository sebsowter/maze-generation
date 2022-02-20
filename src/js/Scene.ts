import "phaser";

const enum Tiles {
  wall = 0,
  neighbour = 1,
  maze = 2,
  passage = 3,
}

export default class TableScene extends Phaser.Scene {
  private layer: Phaser.Tilemaps.DynamicTilemapLayer;
  private timer: Phaser.Time.TimerEvent;
  private tiles: integer[] = [];
  private walls: integer[] = [];
  private border: integer = 1;
  private cols: integer = 496 / 16 - this.border * 2;
  private rows: integer = 496 / 16 - this.border * 2;

  public preload() {
    this.load.image("tiles", "./assets/tiles.png");
  }

  public init() {
    for (let i = 0; i < this.cols * this.rows; i++) {
      this.tiles.push(Tiles.wall);
    }
  }

  public create() {
    const tilemap = this.make.tilemap({
      key: "map",
      tileWidth: 16,
      tileHeight: 16,
      width: 31,
      height: 31,
    });
    const tileset = tilemap.addTilesetImage("tileset", "tiles", 16, 16);

    this.layer = tilemap.createBlankDynamicLayer("layer", tileset);

    for (let y = 0; y < this.rows + this.border * 2; y++) {
      for (let x = 0; x < this.cols + this.border * 2; x++) {
        this.layer.putTileAt(Tiles.wall, x, y);
      }
    }

    const random = Math.floor(Math.random() * (this.tiles.length / 4));
    const index =
      Math.floor(random / (this.cols / 2)) * 2 * this.cols +
      (random % Math.ceil(this.cols / 2)) * 2;

    this.addCellToMaze(index);

    this.timer = this.time.addEvent({
      delay: 10,
      loop: true,
      callbackScope: this,
      callback: function () {
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

  private createRandomRectangle(
    rectangle?: Phaser.Geom.Rectangle
  ): Phaser.Geom.Rectangle {
    const width = rectangle
      ? Math.min(this.getRandomV(rectangle.width), 25)
      : this.getRandomV(24);
    const height = rectangle
      ? Math.min(this.getRandomV(rectangle.height), 25)
      : this.getRandomV(24);
    const x = rectangle
      ? Math.max(this.getRandomV(rectangle.x, true), 0)
      : this.getRandomV(1, true);
    const y = rectangle
      ? Math.max(this.getRandomV(rectangle.y, true), 0)
      : this.getRandomV(1, true);

    return new Phaser.Geom.Rectangle(x, y, width, height);
  }

  private getRandomValue(reverse?: boolean): number {
    const random = Math.floor(Math.random() * 5);
    const value = random === 4 ? 1 : random >= 2 ? -1 : 0;

    return reverse ? value - value : value;
  }

  private getRandomV(value: number, reverse?: boolean): number {
    return Math.max(value + this.getRandomValue(reverse), 1);
  }

  private getMatrixFromRect(rectangles: Phaser.Geom.Rectangle[]): any[] {
    const maxX = 8;
    const maxY = 8;
    const matrix = [];

    for (let y = 0; y < maxY; y++) {
      matrix[y] = [];

      for (let x = 0; x < maxX; x++) {
        matrix[y][x] = 0;
      }
    }

    rectangles.forEach((rectangle) => {
      for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < maxX; x++) {
          const value =
            x >= rectangle.x &&
            x < rectangle.x + rectangle.width &&
            y >= rectangle.y &&
            y < rectangle.y + rectangle.height
              ? 1
              : matrix[y][x];

          matrix[y][x] = value;
        }
      }
    });

    return matrix;
  }

  private createTower(): any[] {
    const maxHeight = 12;
    const matrix = [];

    let rectangle1 = this.createRandomRectangle();
    let rectangle2 = this.createRandomRectangle();

    for (let i = 0; i < maxHeight; i++) {
      rectangle1 = this.createRandomRectangle(i > 2 ? rectangle1 : null);
      rectangle2 = this.createRandomRectangle(i > 2 ? rectangle2 : null);

      matrix.push(this.getMatrixFromRect([rectangle1, rectangle2]));
    }

    return matrix;
  }

  private getNeighbours(tile: integer, direction: integer) {
    const cell = this.indexToCell(tile, 8);
    const right =
      cell.x + 1 < 8 ? new Phaser.Math.Vector2(cell.x + 1, cell.y) : null;
    const bottom =
      cell.y + 1 < 8 ? new Phaser.Math.Vector2(cell.x, cell.y + 1) : null;
    const left =
      cell.x - 1 >= 0 ? new Phaser.Math.Vector2(cell.x - 1, cell.y) : null;
    const top =
      cell.y - 1 >= 0 ? new Phaser.Math.Vector2(cell.x, cell.y - 1) : null;
    const cells = [right, top, left, bottom];
    const neighbours = [];

    for (let i = 0; i < cells.length; i++) {
      neighbours.push(cells[Phaser.Math.Wrap(i + direction, 0, 4)]);
    }

    return neighbours;
  }

  private getStartTile(level: any[]): integer {
    for (let y = level.length - 1; y >= 0; y--) {
      const row = level[y];

      for (let x = 0; x < row.length; x++) {
        if (row[x] === 1) {
          return this.cellToIndex(x, y, row.length);
        }
      }
    }

    return 0;
  }

  private cellToIndex(x: integer, y: integer, cols: integer): integer {
    return y * cols + x;
  }

  private indexToCell(index: integer, cols: integer): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(index % cols, Math.floor(index / cols));
  }

  private addDoors(level: any[]) {
    const length = 4 + Math.floor(Math.random() * 4);
    const door = 1 + Math.floor(Math.random() * (length - 2));
    const path = [];

    let tile = this.getStartTile(level);
    const cell = this.indexToCell(tile, 8);
    let direction = 1;
    console.log("-- tile", tile);
    console.log("door", door);

    path.push(tile);

    level[cell.y][cell.x] = 4;

    let count = 0;

    while (path.length < length && count < 1000) {
      const neighbours = this.getNeighbours(tile, direction);

      let found = false;
      let i = 0;

      while (i < neighbours.length && !found) {
        const neighbour = neighbours[i];

        if (neighbour && level[neighbour.y][neighbour.x] === 1) {
          found = true;
          direction = -i + 1;
          tile = this.cellToIndex(neighbour.x, neighbour.y, 8);
          console.log("path.length", path.length);
          path.push(tile);

          level[neighbour.y][neighbour.x] =
            path.length === door + 1 ? 1 : path.length === length ? 4 : 3;
        }

        i++;
      }

      //console.log('path.length', path.length);

      count++;
    }

    console.log("count", count);

    return level;
  }

  private addCellToMaze(index: integer) {
    this.setCell(index, Tiles.maze);
    this.getAdjacent(index).forEach((cell) => {
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

    if (
      (neighbour > 0 && direction < 0) ||
      (neighbour < this.cols - 1 && direction > 0)
    ) {
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
      (index % this.cols) + this.border,
      Math.floor(index / this.cols) + this.border
    );
  }
}

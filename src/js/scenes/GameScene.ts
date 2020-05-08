import 'phaser';
import Graph from '../graph/Graph';

export default class TableScene extends Phaser.Scene {
  private camera: Phaser.Cameras.Scene2D.BaseCamera;
  private player: Phaser.GameObjects.Image;
  private layer1: Phaser.Tilemaps.DynamicTilemapLayer;
  private maze: integer[] = [];
  private walls: integer[] = [];
  private tiles: any[] = [];

  private graph: Graph;
  private cell: integer;

  private cols: integer = 14;
  private rows: integer = 12;

  constructor() {
    super({
      key: 'game',
      active: true,
      visible: true,
    });
  }

  public init() {
    /*
    this.maze = [
      [0, 0, 0, 0, 1, 2, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 2, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0],
      [0, 1, 2, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 0, 0, 2, 1, 0, 1, 0, 0, 0, 0, 0],
      [1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
    this.maze = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ]
    */
  }

  public preload() {
    this.load.image('tiles', './assets/images/tiles.png');
    this.load.image('player', './assets/images/player.png');
  }
  
  public create() {
    const camera = this.cameras.main;
    const tilemap = this.make.tilemap({
      key: 'map',
      tileWidth: 16,
      tileHeight: 16,
      width: 16,
      height: 16,
    });
    const tileset = tilemap.addTilesetImage('tileset', 'tiles', 16, 16);
    const vertices = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    this.layer1 = tilemap.createBlankDynamicLayer('empty', tileset);
    this.player = this.add.image(16 * 3 - 8, 16 * 3 - 8, 'player');
    
    /*
    this.graph = new Graph(6);

    console.log('this.layer1', this.layer1);
      
    for (var i = 0; i < vertices.length; i++) {
      this.graph.addVertex(vertices[i]);
    } 
    
    this.graph.addEdge('A', 'B');
    this.graph.addEdge('A', 'D');
    this.graph.addEdge('A', 'E');
    this.graph.addEdge('B', 'C');
    this.graph.addEdge('D', 'E');
    this.graph.addEdge('E', 'F');
    this.graph.addEdge('E', 'C');
    this.graph.addEdge('C', 'F');
    this.graph.printGraph();
    */

    this.createLevel();
  }

  public update() {
  }

  private createLevel() {
    /*
    - Start with a grid full of walls.
    - Pick a cell, mark it as part of the maze.
    Add the walls of the cell to the wall list.
    While there are walls in the list:
    Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
    Make the wall a passage and mark the unvisited cell as part of the maze.
    Add the neighboring walls of the cell to the wall list.
    Remove the wall from the list.
    */

    for (let y = 0; y < this.rows + 2; y++) {
      for (let x = 0; x < this.cols + 2; x++) {
        if (x > 0 && y > 0 && x < this.cols + 1 && y < this.rows + 1) {
          this.tiles.push(1);
          this.layer1.putTileAt(1, x, y);
        } else {
          this.layer1.putTileAt(1, x, y);
        }
      }
    }

    this.runAlg();
  }

  private runAlg() {
    this.addCellToMaze(Math.floor(Math.random() * this.tiles.length));

    let count = 0;

    const step = () => {
      const random = Math.floor(Math.random() * this.walls.length);
      const wallIndex = this.walls[random];
      const wallAdjacent = this.getAdjacent(wallIndex);
      const occurances = [];
      wallAdjacent.forEach((cell, index) => {
        if (this.tiles[cell] === 2) {
          occurances.push(index);
        }
      });

      if (occurances.length === 1) {
        this.setCellType(wallIndex, 'corridor');

        const nextIndex = wallAdjacent[Phaser.Math.Wrap(occurances[0] + 2, 0, 4)];
      
        if (nextIndex) {
          this.addCellToMaze(nextIndex);
        }
      } else if (occurances.length === 2) {
        this.setCellType(wallIndex, 'brick');
      }
      console.log('this.walls.length', this.walls.length);
    }

    setInterval(() => {
      if (this.walls.length && count < 1000) {
        step()

        count++;
      }
    }, 50);

    console.log('------', count);
  }

  private addCellToMaze(index: integer) {
    console.log('addCellToMaze', index);

    this.setCellType(index, 'maze');
    
    this.getAdjacent(index).forEach(cell => {
      if (cell !== null) {
        if (this.tiles[cell] !== 3) {
          if (!this.walls.includes(cell)) {
            this.setCellType(cell, 'wall');
          }
        }
      }
    });
  }

  private setCellType(index: integer, type: string) {
    let value = 1;

    switch (type) {
      case 'brick':
        value = 1;
        this.walls.splice(this.walls.indexOf(index), 1);
        break;
      case 'wall':
        value = 4;
        if (!this.walls.includes(index)) {
          this.walls.push(index);
        }
        break;
      case 'maze':
        value = 2;
        if (!this.maze.includes(index)) {
          this.maze.push(index);
        }
        //this.walls.splice(this.walls.indexOf(index), 1);
        break;
      case 'corridor':
        value = 3;
        this.walls.splice(this.walls.indexOf(index), 1);
        break;
    }

    this.setCell(index, value);
  }

  private setCell(index: integer, value: integer) {
    const position = this.getPosition(index);

    this.tiles[index] = value;
    this.layer1.putTileAt(value, position.x, position.y);
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
    const x = index % this.cols;

    if ((x > 0 && direction < 0) || (x < this.cols - 1 && direction > 0)) {    
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

  private getPosition(index: integer) {
    return new Phaser.Math.Vector2(
      index % this.cols + 1,
      Math.floor(index / this.cols) + 1,
    );
  }
}

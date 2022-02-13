function Map(maze) {
  this.createFrom = function (maze) {
    for (let y = 1; y <= maze.row; y++)
      for (let x = 1; x <= maze.col; x++) {
        if (maze.cell(x, y).wall['N']) this.addWall('N', x, y);
        if (maze.cell(x, y).wall['E']) this.addWall('E', x, y);
        if (maze.cell(x, y).wall['S']) this.addWall('S', x, y);
        if (maze.cell(x, y).wall['W']) this.addWall('W', x, y);
      }
  }

  this.addWall = function (orientation, x, y) {
    let X = 2 * (x - 1) + 1;
    let Y = 2 * (y - 1) + 1;

    switch (orientation) {
      case 'N':
        this.addBlock(X - 1, Y - 1);
        this.addBlock(X, Y - 1);
        this.addBlock(X + 1, Y - 1);
        break;
      case 'E':
        this.addBlock(X + 1, Y - 1);
        this.addBlock(X + 1, Y);
        this.addBlock(X + 1, Y + 1);
        break;
      case 'S':
        this.addBlock(X - 1, Y + 1);
        this.addBlock(X, Y + 1);
        this.addBlock(X + 1, Y + 1);
        break;
      case 'W':
        this.addBlock(X - 1, Y - 1);
        this.addBlock(X - 1, Y);
        this.addBlock(X - 1, Y + 1);
        break;
    }
  }

  this.addBlock = function (X, Y) {
    this.grid[Y * this.col + X] = true;
  }

  this.toString = function () {
    let string = '';

    for (let Y = 0; Y < this.row; Y++) {
      for (let X = 0; X < this.col; X++)
        string += this.grid[Y * this.col + X] ? 'O' : ' ';

      string += '\n';
    }

    return string;
  }

  this.col = maze.col * 2 + 1;
  this.row = maze.row * 2 + 1;
  this.grid = new Array(this.col * this.row, false);

  this.createFrom(maze);
}
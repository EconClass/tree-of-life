class TreeOfLife {
  constructor(x, y, size, min) {
    this.root = new Quad(x, y, size, min, size);
    this.currentGen = new Map();
  }

  // Insert a Quad that represents a Cell in the Game of Life 
  insertCell(x, y) {
    this.root.insert(x, y);
  }


  updateGen() {
    // O(2n) -> O(n)
    const living = this.currentBoard().filter((tile) => tile.isAlive);
    for (let live of living) {
      live.getNeighbors().forEach((coord) => {
        if (this.currentGen.has(coord)) {
          let val = this.currentGen.get(coord);
          val++;
          this.currentGen.set(coord, val);
        } else {
          this.currentGen.set(coord, 1);
        }
      });
    }
  };


  makeNextGen() {
    // Grab all the living cell
    const current = this.currentGen.keys();
    const nextLife = [];

    for (const key of current) { // O(n)
      // Check to see which cells live
      const [xPos, yPos] = key.split(',');
      const cell = this.findCell(Number(xPos), Number(yPos));

      if (cell.isAlive === true) { // If the cell is alive...
        // ...check if it survives
        if (this.currentGen.get(key) === 2 || this.currentGen.get(key) === 3) {
          nextLife.push(key);
        }
      }

      // Check if allowed to reincarnate (as if by reproduction)
      if (this.currentGen.get(key) === 3) {
        nextLife.push(key);
      }
    }

    // Burn the Tree O(1)
    this.root.quadrants = null;
    this.root.isDivided = false;
    this.currentGen = new Map();

    // Build the Tree O(nlogn)
    for (const coord of nextLife) {
      const [xPos, yPos] = coord.split(',');
      this.root.insert(Number(xPos), Number(yPos));
    }
  }


  // Returns smallest cell of a given coordinate
  findCell(x, y) {
    // `Number >> 4` effectively does an integer division by 16
    // and `Number << 4` multiplies by 16 this notation is used to avoid floats
    x = (x >> 4) << 4; // x = Math.floor((x / this.root.min) * this.root.min)
    y = (y >> 4) << 4; // y = Math.floor((y / this.root.min) * this.root.min)

    return this._findCell(x, y, this.root);
  };

  _findCell(x, y, node) {
    if (!node) {
      return node;
    }

    if (node.isDivided) {
      return this._findCell(x, y, node.whichQuad(x, y));
    }

    return node;
  };


  // Traverse the tree and return with all quadrants that need to be rendered
  currentBoard() {
    const currentGen = [];
    this._traverse(this.root, currentGen);
    return currentGen;
  };


  // Recursive helper function to traverse the tree
  _traverse(quad, currentGen) {
    if (!quad.isDivided) {
      currentGen.push(quad);
    } else {
      for (const q of quad.quadrants) {
        this._traverse(q, currentGen);
      };
    };
  };
}

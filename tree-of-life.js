class TreeOfLife {
  constructor(x, y, size, min) {
    this.root = new Quad(x, y, size, min, size);
    this.nextGen = new Map();
  }

  // Insert a Quad that represents a Cell in the Game of Life 
  insertCell(x, y) {
    this.root.insert(x, y);
  }


  updateNextGen() {
    // O(2n) -> O(n)
    const living = this.currentBoard().filter((tile) => tile.isAlive);
    for (let live of living) {
      live.getNeighbors().forEach((coord) => {
        if (this.nextGen.has(coord)) {
          let val = this.nextGen.get(coord);
          val++;
          this.nextGen.set(coord, val);
        } else {
          this.nextGen.set(coord, 1);
        }
      });
    }
  };


  makeNextGen() {
    // Grab all the living cells
    const nextLife = [];

    for (const key of this.nextGen.keys()) {
      // Check to see which cells live
      const [xPos, yPos] = key.split(',');
      const cell = this.findLiveCell(Number(xPos), Number(yPos));

      if (cell != null) { // If the cell is alive...
        // ...check if it survives
        if (this.nextGen.get(key) === 2 || this.nextGen.get(key) === 3) {
          nextLife.push(key);
        }
      }

      // Check if allowed to reincarnate (as if by reproduction)
      if (this.nextGen.get(key) === 3) {
        nextLife.push(key);
      }
    }

    // Burn the Tree
    this.root.quadrants = null;
    this.root.isDivided = false;
    this.nextGen = new Map();

    // Build the Tree
    for (const coord of nextLife) {
      const [xPos, yPos] = coord.split(',');
      this.root.insert(Number(xPos), Number(yPos));
    }
  }


  // Returns null if the cell is dead or non-existent
  findLiveCell(x, y) {
    // `Number >> 4` effectively does an integer division by 16
    // and `Number << 4` multiplies by 16 this notation is used to avoid floats
    x = (x >> 4) << 4; // x = Math.floor((x / this.root.min) * this.root.min)
    y = (y >> 4) << 4; // y = Math.floor((y / this.root.min) * this.root.min)

    return this.__findCell__(x, y, this.root);
  };

  __findCell__(x, y, node) {

    if (!node) {
      return null;
    }

    if (node.isDivided) {
      return this.__findCell__(x, y, node.whichQuad(x, y));
    }

    if (node.area.size > this.root.min) {
      return null;
    } else if (!node.isAlive) {
      return null;
    }

    return node;
  };


  // Traverse the tree and return with all quadrants that need to be rendered
  currentBoard() {
    const currentGen = [];
    this.__traverse__(this.root, currentGen);
    return currentGen;
  };


  // Recursive helper function to traverse the tree
  __traverse__(quad, currentGen) {
    if (!quad.isDivided) {
      currentGen.push(quad);
    } else {
      for (const q of quad.quadrants) {
        this.__traverse__(q, currentGen);
      };
    };
  };
}

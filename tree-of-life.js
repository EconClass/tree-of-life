class TreeOfLife {
  constructor(x, y, size, min) {
    this.root = new Quad(x, y, size, min, size);
    this.nextGen = new Map();
  }

  // Insert a Quad that represents a Cell in the Game of Life 
  insertCell(x, y) {
    this.root.insert(x, y)
  }


  updateNextGen() {
    // O(nlogn + n) -> O(n)
    const living = this.currentBoard().filter((tile) => tile.isAlive)
    for (let live of living) {
      live.getNeighbors().forEach((cord) => {
        if (this.nextGen.has(cord)) {
          let val = this.nextGen.get(cord)
          val++
          this.nextGen.set(cord, val)
        } else {
          this.nextGen.set(cord, 1)
        }
      })
    }
  };


  makeNextGen() {
    // Any live cell with two or three neighbors survives.
    // Any dead cell with EXACTLY three live neighbors becomes a live cell.
    // All other live cells die in the next generation. Similarly, all other dead cells stay dead

    // Grab all the living cells
    const nextLife = [];
    for (const key of this.nextGen.keys()) {
      // Check to see if it stays alive
      const [xPos, yPos] = key.split(',')
      const cell = this.findLiveCell(Number(xPos), Number(yPos))

      if (cell != null) {
        if (this.nextGen.get(key) === 2 || this.nextGen.get(key) === 3) {
          nextLife.push(key)
        }
      }

      // Check if allowed to reincarnate
      if (this.nextGen.get(key) === 3) {
        nextLife.push(key)
      }
    }

    const { min, max } = this.root;
    const { x, y, size } = this.root.area;

    // Burn the Tree
    this.root = new Quad(x, y, size, min, max);
    this.nextGen = new Map();

    // Build the Tree
    for (const coord of nextLife) {
      const [xPos, yPos] = coord.split(',')
      this.root.insert(Number(xPos), Number(yPos))
    }
  }


  // Returns null if the cell is dead or non-existent
  findLiveCell(x, y) {
    // `Number >> 4` effectively does an integer division by 16
    // and `Number << 4` multiplies by 16 this notation is used to avoid floats
    x = (x >> 4) << 4;
    y = (y >> 4) << 4;
    return this.__findCell__(x, y, this.root);
  };

  __findCell__(x, y, node) {

    if (!node) {
      return null
    }

    if (node.isDivided) {
      return this.__findCell__(x, y, node.whichQuad(x, y))
    }

    if (node.area.size > this.root.min) {
      return null;
    } else if (!node.isAlive) {
      return null
    }

    return node
  };


  // Traverse the tree and return with all quadrants that need to be rendered
  currentBoard() {
    const currentGen = [];
    this.__traverse__(this.root, currentGen);
    return currentGen;
  };


  // Rcursive helper function to traverse the tree
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

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
    /**
     * RULES OF THE GAME:
     *  1) Any live cell with two or three neighbors survives.
     *  2) Any dead cell with EXACTLY three live neighbors becomes a live cell.
     *  3) All other live cells die in the next generation. Similarly, all other dead cells stay dead.
     */

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

    // const { min, max } = this.root;
    // const { x, y, size } = this.root.area;

    // Burn the Tree
    this.root.quadrants = null;
    this.root.isDivided = false;
    this.nextGen = new Map();

    // Build the Tree
    for (const coord of nextLife) {
      const [xPos, yPos] = coord.split(',');
      const x = Number(xPos);
      const y = Number(yPos);

      // Validate that the points are within bounds
      if (
        x < 0 || x >= this.root.area.size ||
        y < 0 || y >= this.root.area.size
      ) {
        continue;
      }
      else {
        this.root.insert(x, y);
      }
    }
  }


  // Returns null if the cell is dead or non-existent
  findLiveCell(x, y) {
    // `Number >> 4` effectively does an integer division by 16
    // and `Number << 4` multiplies by 16 this notation is used to avoid floats
    // x = Math.floor((x / this.root.min) * this.root.min)
    // y = Math.floor((y / this.root.min) * this.root.min)
    x = (x >> 4) << 4;
    y = (y >> 4) << 4;
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

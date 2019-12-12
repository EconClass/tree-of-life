// Any live cell with two or three neighbors survives.
// Any dead cell with EXACTLY three live neighbors becomes a live cell.
// All other live cells die in the next generation. Similarly, all other dead cells stay dead

//==============================================================================================
class TreeOfLife {
  constructor(x, y, size, min) {
    this.root = new Quad(x, y, size, min, size);
    this.nextGen = new Set();
  }


  // Insert a Quad that represents a Cell in the Game of Life 
  insertCell(x, y) {
    this.root.insert(x, y)
  }


  makeNextGen() {
    // Grab all the living cells
    // O(nlogn + n) -> O(n)
    const living = this.currentBoard().filter((cell) => cell.isAlive);
    const candidates = new Set();
    for (const live of living) {
      live.getNeighbors().forEach((cord) => {
        candidates.add(cord)
      })
    }
  };


  // Returns null if the cell is dead or non-existent
  findLiveCell(x, y) {
    // `Number >> 4` effectively does an integer division by 16
    // and `Number << 4` multiplies by 16 this notation is used to avoid floats
    x = (x >> 4) << 4;
    y = (y >> 4) << 4;
    return this.__findCell__(x, y, this.root);
  };

  __findCell__(x, y, node) {
    if (node.isDivided) {
      return this.__findCell__(x, y, node.whichQuad(x, y))
    }
    if (node.area.size > this.root.min) {
      return null;
    } else if (node.isAlive) {
      return node
    }
  };


  // Traverse the tree and return with all quadrants that need to be rendered
  currentBoard() {
    const currentGen = [];
    this.__traverse__(this.root, currentGen);
    return currentGen;
  };


  // Rcursive helper function to traverse the tree
  __traverse__(quad, currentGen) {
    // console.log(quad)
    if (!quad.isDivided) {
      const res = {
        isAlive: quad.isAlive,
        ...quad.area
      };
      currentGen.push(res);
    } else {
      for (let q of quad.quadrants) {
        this.__traverse__(q, currentGen);
      };
    };
  };
}

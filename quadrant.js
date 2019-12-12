class Boundary {
  constructor(x, y, size) {
    this.x = x
    this.y = y
    this.size = size
  };


  // Returns true if the coordinates passed are within its bounds
  contains(xPos, yPos) {
    const { x, y, size } = this;
    return (
      xPos >= x &&
      xPos < x + size &&
      yPos >= y &&
      yPos < y + size
    );
  };
};


//==============================================================================================
class Quad {
  constructor(x, y, size, min, max) {
    this.max = max
    this.min = min
    this.quadrants = null;
    this.area = new Boundary(x, y, size);
    this.isAlive = false;
    this.isDivided = false;
  };


  getNeighbors() {
    if (this.isAlive && this.area <= this.min) {
      let [left, right, lower, upper] = [
        this.x - this.min, // left x coord from current cell
        this.x + this.min, // right x coord from current cell
        this.y - this.min, // lower y coord from current cell
        this.y + this.min, // upper y coord from current cell
      ]

      // This makes the board a finite field where "leaving" to the left
      // brings it back to the right and vice versa as well as...
      if (left < 0) { left = this.max - this.min }
      else if (right >= this.max) { right = 0 }

      // Leaving from the top brings you back to the bottom and vice versa
      if (lower < 0) { lower = this.max - this.min }
      else if (upper >= this.max) { upper = 0 }

      return [
        `${this.x},${this.y + this.min}`, // upper
        `${this.x},${this.y - this.min}`, // lower
        `${this.x + this.min},${this.y}`, // right
        `${this.x - this.min},${this.y}`, // left
        `${this.x + this.min},${this.y + this.min}`, // upper right
        `${this.x + this.min},${this.y - this.min}`, // lower right
        `${this.x - this.min},${this.y + this.min}`, // upper left
        `${this.x - this.min},${this.y - this.min}`, // lower left
      ]
    };
  };


  // Create Live Cell at x, y position
  insert(x, y) {
    // `Number >> 4` effectively does an integer division by 16
    // and `Number << 4` multiplies by 16 this notation is used to avoid floats
    x = (x >> 4) << 4;
    y = (y >> 4) << 4;
    this.__insert__(x, y);
  };

  __insert__(x, y) {
    // Insert cell ONLY at the LOWEST possible subtree
    if (this.area.size <= this.min && this.area.contains(x, y)) {
      this.isAlive = true;
    };

    // Create subdivisions if possible and try the insert again
    if (this.area.size > this.min) {
      if (!this.isDivided) {
        this.subdivide();
      };
      // Recursively find the proper quadrant to insert cell to
      const quad = this.whichQuad(x, y);
      quad.__insert__(x, y);
    };
  };


  // Return the quadrant a given point belongs to
  whichQuad(x, y) {
    if (this.quadrants === null) {
      throw new Error("This is NOT divided!")
    };
    for (let quad of this.quadrants) {
      if (quad.area.contains(x, y)) {
        return quad
      }
    }
  };


  // Divide the tree into 4 subdivisions of quadtrees
  subdivide() {
    if (this.area.size <= this.min) {
      throw new RangeError("Cannot subdivide past minimum quadrant size!")
    }

    const { x, y, size } = this.area;
    const offset = size >> 1;
    // `Number >> 1` is effectively an integer division by 2
    this.isDivided = true;
    this.quadrants = [
      new Quad(x + offset, y, size >> 1, this.min, this.max), // NE
      new Quad(x, y, size >> 1, this.min, this.max), // NW
      new Quad(x, y + offset, size >> 1, this.min, this.max), // SW
      new Quad(x + offset, y + offset, size >> 1, this.min, this.max), // SE
    ];
  };
};


class Boundary {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
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
    this.max = max;
    this.min = min;
    this.quadrants = null;
    this.area = new Boundary(x, y, size);
    this.isAlive = false;
    this.isDivided = false;
  };

  getNeighbors() {
    let [left, right, lower, upper] = [
      this.area.x - this.min, // left x coord from current cell
      this.area.x + this.min, // right x coord from current cell
      this.area.y + this.min, // lower y coord from current cell
      this.area.y - this.min, // upper y coord from current cell
    ];

    // This makes the board a finite field where "leaving" to the left
    // brings it back to the right and vice versa...
    if (left < 0) { left = this.max - this.min; }
    else if (right >= this.max) { right = 0; }

    // Also leaving from the top brings you back to the bottom and vice versa
    if (upper < 0) { upper = this.max - this.min; }
    else if (lower >= this.max) { lower = 0; }

    return [
      `${this.area.x},${upper}`, // upper
      `${this.area.x},${lower}`, // lower
      `${right},${this.area.y}`, // right
      `${left},${this.area.y}`, // left
      `${right},${upper}`, // upper right
      `${right},${lower}`, // lower right
      `${left},${upper}`, // upper left
      `${left},${lower}`, // lower left
    ];
  };


  // Create Live Cell at x, y position
  insert(x, y) {
    // `Number >> 4` effectively does an integer division by 16 and
    // `Number << 4` multiplies by 16 this notation is used to avoid floats
    x = (x >> 4) << 4; // x = Math.floor((x / this.min) * this.min)
    y = (y >> 4) << 4; // y = Math.floor((y / this.min) * this.min)

    this.__insert__(x, y);
  };

  __insert__(x, y) {
    // Insert cell ONLY at the LOWEST possible quadrant
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
    if (!this.quadrants) {
      throw new Error("This is NOT divided!");
    };
    for (const quad of this.quadrants) {
      if (quad.area.contains(x, y)) {
        return quad;
      }
    }
    return null;
  };


  // Divide the tree into 4 subdivisions of quadtrees
  subdivide() {
    if (this.area.size <= this.min) {
      throw new RangeError("Cannot subdivide past minimum quadrant size!");
    }

    const { x, y, size } = this.area;
    // `Number >> 1` is effectively an integer division by 2
    const offset = size >> 1;
    this.isDivided = true;
    this.quadrants = [
      new Quad(x + offset, y, size >> 1, this.min, this.max), // NE
      new Quad(x, y, size >> 1, this.min, this.max), // NW
      new Quad(x, y + offset, size >> 1, this.min, this.max), // SW
      new Quad(x + offset, y + offset, size >> 1, this.min, this.max), // SE
    ];
  };
};

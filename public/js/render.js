const canvas = document.getElementById("quadtree");
const ctx = canvas.getContext("2d");

class UI {
  constructor() {
    this.liveColor = "#2c3b9a";
    this.deadColor = "#838fdc";
    this.renderInterval = 350;
    this.prevInterval = 350;
    this.cellSize = 16;
    this.gridSize = 1024;
    this.tree = new TreeOfLife(0, 0, this.gridSize, this.cellSize);
    this.playing = true;
  }

  pausePlay = () => {
    this.playing = !this.playing;
    if (this.playing) {
      this.loop();
    }
  };

  renderQuads = () => {
    ctx.clearRect(0, 0, this.gridSize, this.gridSize);
    const quads = this.tree.currentBoard();

    quads.forEach((quad) => {
      const { x, y, size } = quad.area;
      ctx.fillStyle = this.deadColor;
      if (quad.isAlive) {
        ctx.fillStyle = this.liveColor;
        ctx.fillRect(x, y, size, size);
      };
      ctx.fillRect(x, y, size, size);
      ctx.beginPath();
      ctx.rect(x, y, size, size);
      ctx.stroke();
    });
  };

  renderLife = () => {
    this.tree.updateGen();
    this.tree.makeNextGen();
    this.renderQuads();
  };

  randomize = () => {
    const init = 256;

    const xCoords = randomArray(init, this.gridSize - this.cellSize);
    const yCoords = randomArray(init, this.gridSize - this.cellSize);
    this.tree.root.quadrants = null;
    this.tree.root.isDivided = false;
    this.tree.currentGen = new Map();
    for (let i = 0; i < init; i++) {
      this.tree.insertCell(xCoords[i], yCoords[i]);
    }

    this.renderQuads();
  };

  loop = () => {
    this.renderLife();
    if (!this.playing) {
      return;
    } else {
      setTimeout(this.loop, this.renderInterval);
    }
  };
};

// Insert cell at mouse location on canvas
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  interface.tree.insertCell(x, y);
  interface.renderQuads();
});


function randomArray(length, max) {
  return [...new Array(length)]
    .map(() => Math.round(Math.random() * max));
}

const interface = new UI();

window.onload = function () {
  const gui = new dat.GUI();
  gui.addColor(interface, 'liveColor');
  gui.addColor(interface, 'deadColor');
  const controller = gui.add(interface, 'renderInterval', 50, 750);
  controller.onFinishChange((val) => {
    interface.renderInterval = val;
  });
  gui.add(interface, 'randomize');
  gui.add(interface, 'pausePlay');
  interface.randomize();
};

interface.loop();
let TREE = new TreeOfLife(0, 0, 1024, 16);;

const canvas = document.getElementById("quadtree");
const ctx = canvas.getContext("2d");

const render = () => {
  ctx.clearRect(0, 0, 1024, 1024);
  const quads = TREE.currentBoard();

  quads.forEach((quad) => {
    const { x, y, size } = quad.area
    ctx.fillStyle = "#838fdc"
    if (quad.isAlive) {
      ctx.fillStyle = "#2c3b9a";
      ctx.fillRect(x, y, size, size);
    };
    ctx.fillRect(x, y, size, size)
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.stroke();
  });
};

// Insert cell at mouse location on canvas
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  TREE.insertCell(x, y);
  render();
});

const randRender = () => {
  // TREE = new TreeOfLife(0, 0, 1024, 16);
  const init = 256;
  const xCoords = randomArray(init, 1024 - 16);
  const yCoords = randomArray(init, 1024 - 16);
  for (let i = 0; i < init; i++) {
    TREE.insertCell(xCoords[i], yCoords[i])
  }
  render();
}

const renderLife = () => {
  TREE.updateNextGen()
  TREE.makeNextGen()
  render();
}

function randomArray(length, max) {
  return [...new Array(length)]
    .map(() => Math.round(Math.random() * max));
}
// render()
randRender();
requestAnimationFrame(() => { setInterval(renderLife, 100) });
// renderLife()
# Tree of Life

This is a visualizer for Conway's Game of Life traditional visualizers depict the game using a two dimensional grid or matrix that is iterated over for every cell in the game regardless of whether they are dead or alive. This ends up being pretty "slow", having a runtime complexity of O(n^2). However, by switching how the game is stored from a matrix to a quad-tree we can make the game a bit "faster", with a time complexity of O(n * log(n)).



## Rules of the Game

1) Any live cell with two or three neighbors survives.

2) Any dead cell with EXACTLY three live neighbors becomes a live cell.

3) All other live cells die in the next generation and all other dead cells stay dead.


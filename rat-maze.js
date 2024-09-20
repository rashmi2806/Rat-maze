// Event listeners for button clicks
document.getElementById('create-maze').addEventListener('click', createMaze);
document.getElementById('start-rat').addEventListener('click', startRat);
document.getElementById('reset-maze').addEventListener('click', resetMaze);
document.getElementById('pause-rat').addEventListener('click', pauseRat);
document.getElementById('restart-rat').addEventListener('click', restartRat);

// Initialize variables
let maze = [];
let ratPosition = { row: 0, col: 0 };
let destination = { row: 4, col: 4 };
let mazeRows, mazeCols, blockedNodes;
let ratRunning = false;
let paused = false;  // Tracking if the movement is paused


// Creates a new maze based on user input and renders it
function createMaze() {
  mazeRows = parseInt(document.getElementById('rows').value);
  mazeCols = parseInt(document.getElementById('cols').value);
  blockedNodes = parseInt(document.getElementById('blocked-nodes').value);

  maze = Array(mazeRows).fill().map(() => Array(mazeCols).fill(0));
  document.getElementById('maze').style.gridTemplateColumns = `repeat(${mazeCols}, 1fr)`;

  generateWalls();
  renderMaze();

  document.getElementById('start-rat').disabled = false;
  document.getElementById('pause-rat').disabled = true;
  document.getElementById('restart-rat').disabled = true;
}

// Randomly generate walls in the maze
function generateWalls() {
  let blockedCount = 0;
  while (blockedCount < blockedNodes) {
    let row = Math.floor(Math.random() * mazeRows);
    let col = Math.floor(Math.random() * mazeCols);

    if ((row !== 0 || col !== 0) && (row !== mazeRows - 1 || col !== mazeCols - 1)
      && maze[row][col] === 0) {
      maze[row][col] = 1;
      blockedCount++;
    }
  }
}

// Render the maze to the screen
function renderMaze() {
  const mazeDiv = document.getElementById('maze');
  mazeDiv.innerHTML = '';

  maze.forEach((row, rowIndex) => {
    row.forEach((node, colIndex) => {
      const nodeDiv = document.createElement('div');
      nodeDiv.classList.add('node');

      if (node === 1) {
        nodeDiv.classList.add('wall');
      } else if (rowIndex === 0 && colIndex === 0) {
        nodeDiv.classList.add('source');
        nodeDiv.innerText = 'S';
      } else if (rowIndex === mazeRows - 1 && colIndex === mazeCols - 1) {
        nodeDiv.classList.add('destination');
        nodeDiv.innerText = 'D';
      } else {
        nodeDiv.classList.add('path');
      }

      mazeDiv.appendChild(nodeDiv);
    });
  });
}


// Start the rat's movement through the maze
function startRat() {
  ratRunning = true;
  paused = false;
  document.getElementById('pause-rat').innerText = 'Pause';
  document.getElementById('pause-rat').disabled = false;
  document.getElementById('restart-rat').disabled = false;
  moveRat(0, 0);
}

// Move the rat through the maze using recursion
async function moveRat(row, col) {
  if (!ratRunning || paused) return;

  if (row === mazeRows - 1 && col === mazeCols - 1) {
    document.getElementById('msg').innerText = 'Victory! Rat reached the destination!';
    return;
  }

  if (isSafeMove(row, col)) {
    highlightCell(row, col, 'rat'); // Highlight the rat's current position
    await delay(2000);

    if (isSafeMove(row + 1, col)) await moveRat(row + 1, col); //Down
    if (isSafeMove(row - 1, col)) await moveRat(row - 1, col); //Up
    if (isSafeMove(row, col + 1)) await moveRat(row, col + 1); //Right
    if (isSafeMove(row, col - 1)) await moveRat(row, col - 1); //Left
  }

  highlightCell(row, col, 'path');  // Clear the rat's previous position
}

// Check if a move is within bounds and not a wall
function isSafeMove(row, col) {
  return row >= 0 && col >= 0 && row < mazeRows && col < mazeCols && maze[row][col] === 0;
}


// Highlight a specific cell in the maze
function highlightCell(row, col, className) {
  const mazeDiv = document.getElementById('maze');
  const totalColumns = maze[0].length;
  const cellIndex = row * totalColumns + col;

  if (cellIndex < 0 || cellIndex >= mazeDiv.children.length) {
    return;
  }

  const cell = mazeDiv.children[cellIndex];
  if (cell) {
    cell.classList.add(className);
  }
}

// Delay function for waiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Reset the maze and the game state
function resetMaze() {
  document.getElementById('maze').innerHTML = '';
  document.getElementById('msg').innerText = '';
  ratRunning = false;
  paused = false;
  document.getElementById('start-rat').disabled = false;
  document.getElementById('pause-rat').disabled = true;
  document.getElementById('restart-rat').disabled = true;
}

// Pause or resume the rat's movement
function pauseRat() {
  paused = !paused;
  if (paused) {
    document.getElementById('pause-rat').innerText = 'Resume';
  } else {
    document.getElementById('pause-rat').innerText = 'Pause';
    moveRat(ratPosition.row, ratPosition.col);
  }
}

// Restart the rat's journey from the beginning
function restartRat() {
  ratRunning = true;
  paused = false;
  ratPosition = { row: 0, col: 0 };
  document.getElementById('msg').innerText = '';
  renderMaze(); // Re-render the maze
  moveRat(0, 0); // Start moving the rat again
}

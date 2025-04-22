export const aStar = (grid, start, end) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const openSet = [start];
  const cameFrom = new Map();

  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  gScore[start.row][start.col] = 0;

  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  fScore[start.row][start.col] = heuristic(start, end);

  while (openSet.length > 0) {
    // Get node in openSet with lowest fScore
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      const a = openSet[i];
      const b = openSet[currentIndex];
      if (fScore[a.row][a.col] < fScore[b.row][b.col]) {
        currentIndex = i;
      }
    }

    const current = openSet[currentIndex];

    if (current.row === end.row && current.col === end.col) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(currentIndex, 1); // Remove current from openSet

    for (const neighbor of getNeighbors(current, grid)) {
      const { row, col } = neighbor;
      const tentativeG = gScore[current.row][current.col] + 1;

      if (tentativeG < gScore[row][col]) {
        cameFrom.set(`${row},${col}`, current);
        gScore[row][col] = tentativeG;
        fScore[row][col] = tentativeG + heuristic(neighbor, end);

        if (!openSet.some((n) => n.row === row && n.col === col)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return []; // No path found
};

function heuristic(a, b) {
  // Manhattan distance
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function getNeighbors({ row, col }, grid) {
  const neighbors = [];
  const directions = [
    [0, 1],
    [1, 0],
    [-1, 0],
    [0, -1],
  ];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (
      r >= 0 &&
      r < grid.length &&
      c >= 0 &&
      c < grid[0].length &&
      !grid[r][c].isWall
    ) {
      neighbors.push({ row: r, col: c });
    }
  }

  return neighbors;
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(`${current.row},${current.col}`)) {
    current = cameFrom.get(`${current.row},${current.col}`);
    path.push(current);
  }
  return path.reverse();
}


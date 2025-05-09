import { Coordinate, GridType } from "@/types/grid";

/**
 * Finds the start coordinate in the grid.
 * @param grid - The 2D grid array containing cells with `isStart` property.
 * @returns The coordinate of the start cell, or null if not found.
 */
export const getCoordinate = (
  grid: GridType,
  value: "isStart" | "isEnd" | "isWall"
): Coordinate | null => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col][value]) {
        return { row, col };
      }
    }
  }
  return null;
};

/**
 * Retrieves all walkable neighboring cells (non-wall) from the given coordinate.
 * Only considers up, down, left, and right (no diagonals).
 *
 * @param param0 - The current coordinate (row, col).
 * @param grid - The grid to search within.
 * @returns An array of valid neighbor coordinates.
 */
export const getNeighbors = (
  { row, col }: Coordinate,
  grid: GridType
): Coordinate[] => {
  const neighbors: Coordinate[] = [];

  // Directions: right, down, up, left
  const directions = [
    [0, 1], // right
    [1, 0], // down
    [-1, 0], // up
    [0, -1], // left
  ];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;

    // Check boundaries and if cell is not a wall
    if (
      r >= 0 &&
      r < grid.length &&
      c >= 0 &&
      c < grid[0].length &&
      !grid[r][c].isWall &&
      !grid[r][c].visited
    ) {
      grid[r][c].visited = true;
      neighbors.push({ row: r, col: c });
    }
  }

  return neighbors;
};

/**
 * Delays execution for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Creates an empty grid with the specified number of rows and columns.
 * Each cell in the grid is initialized with `isStart`, `isEnd`, and `isWall` set to `false`.
 *
 * @param {number} numRows - The number of rows in the grid.
 * @param {number} numCols - The number of columns in the grid.
 * @returns {GridType} A 2D array representing the grid, where each cell is an object
 * with properties `isStart`, `isEnd`, and `isWall` set to `false`.
 */
export const createEmptyGrid = (numRows: number, numCols: number): GridType => {
  const grid = [];
  for (let row = 0; row < numRows; row++) {
    const currentRow = [];
    for (let col = 0; col < numCols; col++) {
      currentRow.push({
        isStart: false,
        isEnd: false,
        isWall: false,
        visited: false,
      });
    }
    grid.push(currentRow);
  }

  return grid;
};

/**
 * Generates a random coordinate within the given grid dimensions.
 *
 * @param {number} rows - The number of rows in the grid.
 * @param {number} cols - The number of columns in the grid.
 * @returns {Coordinate} A coordinate object containing a randomly generated row and column.
 */
export const getRandomCoordinate = (rows: number, cols: number): Coordinate => {
  const row = Math.floor(Math.random() * rows);
  const col = Math.floor(Math.random() * cols);
  return { row, col };
};

/**
 * Updates the grid with the start and end positions.
 *
 * @param {GridType} grid - The current grid to be updated.
 * @param {Coordinate} start - The coordinate representing the start position.
 * @param {Coordinate} end - The coordinate representing the end position.
 * @returns {any[]} A new grid with the start and end positions marked.
 */
export const updateGridWithStartEnd = (
  grid: GridType,
  start: Coordinate,
  end: Coordinate
) => {
  const newGrid = [...grid];
  newGrid[start.row][start.col].isStart = true; // mark start position
  newGrid[end.row][end.col].isEnd = true; // mark end position
  return newGrid;
};

/**
 * Randomly places walls on the grid.
 * The function will randomly mark cells as walls, ensuring that the start and end positions are not turned into walls.
 *
 * @param {GridType} grid - The grid to place walls on.
 * @param {Coordinate} start - The start position that should not be turned into a wall.
 * @param {Coordinate} end - The end position that should not be turned into a wall.
 * @param {number} wallDensity - The percentage (0-100) of the grid that should be filled with walls.
 * @returns {GridType} The updated grid with randomly placed walls.
 */
export const randomlyPlaceWalls = (
  grid: GridType,
  wallDensity: number
): GridType => {
  const newGrid = [...grid];
  const totalCells = grid.length * grid[0].length;
  const wallCount = Math.floor((wallDensity / 100) * totalCells);

  let wallsPlaced = 0;

  while (wallsPlaced < wallCount) {
    const row = Math.floor(Math.random() * grid.length);
    const col = Math.floor(Math.random() * grid[0].length);

    // Avoid placing walls on the start and end positions
    if (
      newGrid[row][col].isStart ||
      newGrid[row][col].isEnd ||
      newGrid[row][col].isWall
    ) {
      continue; // Skip if it's the start, end, or already a wall
    }

    newGrid[row][col].isWall = true;
    wallsPlaced++;
  }

  return newGrid;
};

/**
 * Creates a 2D grid (array of arrays) populated with a specified value.
 *
 * @param {number} numRows - The number of rows in the grid.
 * @param {number} numCols - The number of columns in each row.
 * @param {*} value - The value to fill each cell in the grid.
 * @returns {any[][]} A 2D array where each cell contains the specified value.
 */
export const createPopulatedGrid = (
  numRows: number,
  numCols: number,
  value: any
) => {
  return Array.from({ length: numRows }, () => Array(numCols).fill(value));
};

/**
 * Reconstructs the shortest path from a 2D array of previous nodes (as generated by A* or similar algorithm).
 *
 * @param {Array<Array<Coordinate | null>>} prev - 2D array representing the previous coordinate for each cell.
 * @param {Coordinate} start - The starting coordinate of the path.
 * @param {Coordinate} end - The ending coordinate of the path.
 * @returns {Coordinate[]} An array of coordinates representing the reconstructed path from start to end.
 *                         Returns an empty array if no valid path exists.
 */
export const reconstructPath = (
  prev: (Coordinate | null)[][],
  start: Coordinate,
  end: Coordinate
): Coordinate[] => {
  const path: Coordinate[] = [];
  let current: Coordinate | null = end;

  while (current && (current.row !== start.row || current.col !== start.col)) {
    path.push(current);
    current = prev[current.row][current.col];
  }

  if (!current) return []; // No path back to start

  path.push(start); // Add start node
  return path.reverse();
};


/**
 * Calculates the Manhattan distance between two coordinates.
 *
 * @param a - The first coordinate.
 * @param b - The second coordinate.
 * @returns The Manhattan distance between the two points (used as a heuristic in A*).
 */
export const manhattanHeuristic = (a: Coordinate, b: Coordinate): number => {
  // Manhattan distance: horizontal + vertical distance
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}
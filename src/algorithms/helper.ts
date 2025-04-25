import { Coordinate, GridType } from "@/types/grid";

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
      !grid[r][c].isWall
    ) {
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

import { Coordinate, GridType, sleep } from "@/constants/grid";

import { getNeighbors } from "./helper";

/**
 * Performs the A* pathfinding algorithm on a 2D grid.
 *
 * @param grid - A 2D array representing the grid; each cell holds data about walls, etc.
 * @param start - The starting coordinate (row and col).
 * @param end - The destination coordinate (row and col).
 * @returns An array of Coordinates representing the shortest path from start to end,
 *          or an empty array if no path is found.
 */
export const aStar = async (
  grid: GridType,
  start: Coordinate,
  end: Coordinate,
  setGrid: (grid: GridType) => void
): Promise<Coordinate[]> => {
  const rows = grid.length;
  const cols = grid[0].length;

  // The set of discovered nodes that may need to be re-evaluated
  const openSet: Coordinate[] = [start];

  // Maps a coordinate key (like "3,4") to the coordinate it came from (for path reconstruction)
  const cameFrom = new Map<string, Coordinate>();

  // gScore stores the cost of the cheapest path from start to each cell
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  gScore[start.row][start.col] = 0;

  // fScore estimates the total cost from start to end passing through each cell
  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  fScore[start.row][start.col] = heuristic(start, end);

  while (openSet.length > 0) {
    // Find the node in openSet with the lowest fScore
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      const a = openSet[i];
      const b = openSet[currentIndex];
      if (fScore[a.row][a.col] < fScore[b.row][b.col]) {
        currentIndex = i;
      }
    }

    const current = openSet[currentIndex];
    const localGrid = grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));
    localGrid[current.row][current.col].isVisiting = true;
    setGrid(localGrid);
    await sleep(100); // sleeps for 0.1 second

    // If we've reached the goal, reconstruct and return the path
    if (current.row === end.row && current.col === end.col) {
      return reconstructPath(cameFrom, current);
    }

    // Remove the current node from openSet
    openSet.splice(currentIndex, 1);

    // Explore neighbors of the current node
    for (const neighbor of getNeighbors(current, grid)) {
      const { row, col } = neighbor;
      const tentativeG = gScore[current.row][current.col] + 1;

      if (tentativeG < gScore[row][col]) {
        // This path to neighbor is better than any previous one
        cameFrom.set(`${row},${col}`, current);
        gScore[row][col] = tentativeG;
        fScore[row][col] = tentativeG + heuristic(neighbor, end);

        // If neighbor is not already in openSet, add it
        if (!openSet.some((n) => n.row === row && n.col === col)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  // No path was found
  return [];
};

/**
 * Calculates the Manhattan distance between two coordinates.
 *
 * @param a - The first coordinate.
 * @param b - The second coordinate.
 * @returns The Manhattan distance between the two points (used as a heuristic in A*).
 */
function heuristic(a: Coordinate, b: Coordinate): number {
  // Manhattan distance: horizontal + vertical distance
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Reconstructs the path from the end coordinate to the start using the `cameFrom` map.
 *
 * @param cameFrom - A map of each visited cell and the cell it came from.
 * @param current - The end coordinate.
 * @returns An array of coordinates representing the path from start to end.
 */
function reconstructPath(
  cameFrom: Map<string, Coordinate>,
  current: Coordinate
): Coordinate[] {
  const path: Coordinate[] = [current];

  // Backtrack from current to start using the map
  while (cameFrom.has(`${current.row},${current.col}`)) {
    current = cameFrom.get(`${current.row},${current.col}`)!;
    path.push(current);
  }

  // Reverse to get path from start to end
  return path.reverse();
}

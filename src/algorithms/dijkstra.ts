import { Coordinate, GridType } from "@/types/grid";
import { getNeighbors, sleep } from "./helper";

import { MinHeap } from "@/datastructures/min_heap";

const createPopulatedGrid = (numRows: number, numCols: number, value: any) => {
  return Array.from({ length: numRows }, () => Array(numCols).fill(value));
};

/**
 * Dijkstra's algorithm on a 2D grid.
 *
 * @param grid - A 2D array representing the grid; each cell holds data about walls, etc.
 * @param start - The starting coordinate (row and col).
 * @param end - The destination coordinate (row and col).
 * @returns An array of Coordinates representing the shortest path from start to end,
 *          or an empty array if no path is found.
 */
export const dijkstra = async (
  grid: GridType,
  start: Coordinate,
  end: Coordinate,
  setGrid: (grid: GridType) => void
): Promise<Coordinate[]> => {
  const numRows = grid.length;
  const numCols = grid[0].length;

  const distances = createPopulatedGrid(numRows, numCols, Infinity);
  const visited = createPopulatedGrid(numRows, numCols, false);
  const prev = createPopulatedGrid(numRows, numCols, null);

  distances[start.row][start.col] = 0;

  const pq = new MinHeap();
  pq.insert({ row: start.row, col: start.col, dist: 0 });

  while (!pq.isEmpty()) {
    const { row, col, dist } = pq.extractMin();

    if (visited[row][col]) continue;
    visited[row][col] = true;

    const localGrid = grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));
    localGrid[row][col].isVisiting = true;
    setGrid(localGrid);
    await sleep(100); // sleeps for 0.1 second

    if (row === end.row && col === end.col) break;

    for (const neighbor of getNeighbors({ row, col }, grid)) {
      const { row: newRow, col: newCol } = neighbor;

      if (!visited[newRow][newCol]) {
        const newDist = dist + 1; // Add the cost of entering that cell to the distance

        if (newDist < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDist;
          prev[newRow][newCol] = { row, col };
          pq.insert({ row: newRow, col: newCol, dist: newDist });
        }
      }
    }
  }

  // Reconstruct path
  const path = [];
  let current = end;

  while (current) {
    path.push(current);
    current = prev[current.row][current.col];
  }

  path.reverse();

  if (path[0].row !== start.row || path[0].col !== start.col) {
    return []; // No valid path found
  }

  return path;
};

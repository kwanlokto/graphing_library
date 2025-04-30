import { Coordinate, GridType } from "@/types/grid";
import {
  createPopulatedGrid,
  getCoordinate,
  getNeighbors,
  reconstructPath,
  sleep,
} from "./helper";

export const pseudocode = `
// BFS Pseudocode

function BFS(start, goal, grid):
    create a queue and enqueue start
    mark start as visited
    create a map prev to track the previous node for each visited cell

    while queue is not empty:
        current = dequeue from queue

        if current == goal:
            break

        for each neighbor of current:
            if neighbor is within bounds AND not a wall AND not visited:
                enqueue neighbor
                mark neighbor as visited
                set prev[neighbor] = current

    return prev
`;

/**
 * Performs the BFS pathfinding algorithm on a 2D grid.
 *
 * @param grid - A 2D array representing the grid; each cell holds data about walls, etc.
 * @param setGrid - Setter function to update the grid.
 * @returns An array of Coordinates representing the shortest path from start to end,
 *          or an empty array if no path is found.
 */
export const BFS = async (
  __grid: GridType,
  setGrid: (grid: GridType) => void
): Promise<Coordinate[]> => {
  const grid = __grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));
  const start = getCoordinate(grid, "isStart");
  const end = getCoordinate(grid, "isEnd");
  if (start === null || end === null)
    throw Error("Failed to find start or end");

  const numRows = grid.length;
  const numCols = grid[0].length;

  const prev: (Coordinate | null)[][] = createPopulatedGrid(
    numRows,
    numCols,
    null
  );

  const queue: Coordinate[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;

    const localGrid = __grid.map((rowArr) =>
      rowArr.map((cell) => ({ ...cell }))
    );
    localGrid[current.row][current.col].isVisiting = true;
    setGrid(localGrid);
    await sleep(100); // sleeps for 0.1 second

    if (grid[current.row][current.col].isEnd) break;

    for (const neighbor of getNeighbors(current, grid)) {
      const { row: newRow, col: newCol } = neighbor;
      prev[newRow][newCol] = current;
      queue.push({ row: newRow, col: newCol });
    }
  }

  return reconstructPath(prev, start, end);
};

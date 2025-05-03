import { Coordinate, GridType } from "@/types/grid";
import {
  createPopulatedGrid,
  getCoordinate,
  getNeighbors,
  manhattanHeuristic,
  reconstructPath,
  sleep,
} from "./helper";

export const pseudocode = `
// Greedy Best First Search Pathfinding Pseudocode

function GreedyBestFirstSearch(start, goal):
    openSet ← PriorityQueue ordered by h(n)
    openSet.add(start)
    cameFrom ← empty map
    visited ← empty set

    while openSet is not empty:
        current ← openSet.pop()

        if current == goal:
            return reconstruct_path(cameFrom, current)

        visited.add(current)

        for each neighbor of current:
            if neighbor not in visited:
                visited.add(neighbor)
                cameFrom[neighbor] ← current
                openSet.add(neighbor)

    return failure (no path found)


function reconstruct_path(cameFrom, current):
    path ← [current]
    while current in cameFrom:
        current ← cameFrom[current]
        path.prepend(current)
    return path
`;

/**
 * Performs the Greedy Best-First Search algorithm on a 2D grid to find the shortest path
 * from the start node to the end node using a heuristic-based approach (Manhattan distance).
 * This version includes optional visual updates via `setGrid` and delays for visualization.
 *
 * @param __grid - The original grid containing cells with properties like `isStart` and `isEnd`.
 *                            Each cell is assumed to have metadata needed for pathfinding.
 * @param setGrid - A callback function to update the grid for visualization.
 *
 * @returns - A promise that resolves to an array of coordinates representing the
 *                                    shortest path from start to end, reconstructed after the search completes.
 */
export const greedyBestFirstSearch = async (
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

  // hScore estimates the total cost from start to end passing through each cell
  const hScore: number[][] = createPopulatedGrid(numRows, numCols, Infinity);
  hScore[start.row][start.col] = manhattanHeuristic(start, end);

  const prev: (Coordinate | null)[][] = createPopulatedGrid(
    numRows,
    numCols,
    null
  );

  // The set of discovered nodes that may need to be re-evaluated
  const openSet: Coordinate[] = [start];

  while (openSet.length > 0) {
    // Find the node in openSet with the lowest hScore
    let currentIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      const a = openSet[i];
      const b = openSet[currentIndex];
      if (hScore[a.row][a.col] < hScore[b.row][b.col]) {
        currentIndex = i;
      }
    }

    const current = openSet[currentIndex];
    const localGrid = __grid.map((rowArr) =>
      rowArr.map((cell) => ({ ...cell }))
    );
    localGrid[current.row][current.col].isVisiting = true;
    setGrid(localGrid);
    await sleep(100); // sleeps for 0.1 second

    // If we've reached the goal, reconstruct and return the path
    if (grid[current.row][current.col].isEnd) break;

    // Remove the current node from openSet
    openSet.splice(currentIndex, 1);

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const { row: newRow, col: newCol } = neighbor;
      hScore[newRow][newCol] = manhattanHeuristic(neighbor, end);

      if (!openSet.some((n) => n.row === newRow && n.col === newCol)) {
        prev[newRow][newCol] = current;
        openSet.push(neighbor);
      }
    }
  }

  return reconstructPath(prev, start, end);
};

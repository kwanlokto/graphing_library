import { Coordinate, GridType } from "@/types/grid";
import {
  createPopulatedGrid,
  getCoordinate,
  getNeighbors,
  reconstructPath,
  sleep,
} from "./helper";

import { MinHeap } from "@/datastructures/min_heap";

export const pseudocode = `
// Dijkstra Pathfinding Pseudocode

function Dijkstra(Graph, source):
    create distance map: distance[node] = ∞ for each node in Graph
    distance[source] = 0

    create a priority queue Q
    Q.insert(source, 0)

    while Q is not empty:
        current = Q.extract_min()  // Node with the smallest distance

        for each neighbor of current:
            alt = distance[current] + weight(current, neighbor)
            if alt < distance[neighbor]:
                distance[neighbor] = alt
                Q.insert_or_update(neighbor, alt)

    return distance
`;

/**
 * Dijkstra's algorithm on a 2D grid.
 *
 * @param grid - A 2D array representing the grid; each cell holds data about walls, etc.
 * @param setGrid - Setter function to update the grid.
 * @returns An array of Coordinates representing the shortest path from start to end,
 *          or an empty array if no path is found.
 */
export const dijkstra = async (
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

  const distances: number[][] = createPopulatedGrid(numRows, numCols, Infinity);
  const prev: (Coordinate | null)[][] = createPopulatedGrid(
    numRows,
    numCols,
    null
  );

  distances[start.row][start.col] = 0;

  const pq = new MinHeap();
  pq.insert({ row: start.row, col: start.col, dist: 0 });

  while (!pq.isEmpty()) {
    const { row, col, dist } = pq.extractMin();

    const localGrid = __grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));
    localGrid[row][col].isVisiting = true;
    setGrid(localGrid);
    await sleep(100); // sleeps for 0.1 second

    if (grid[row][col].isEnd) break;

    for (const neighbor of getNeighbors({ row, col }, grid)) {
      const { row: newRow, col: newCol } = neighbor;

      const newDist = dist + 1; // Add the cost of entering that cell to the distance
      if (newDist < distances[newRow][newCol]) {
        distances[newRow][newCol] = newDist;
        prev[newRow][newCol] = { row, col };
        pq.insert({ row: newRow, col: newCol, dist: newDist });
      }
    }
  }

  return reconstructPath(prev, start, end);
};

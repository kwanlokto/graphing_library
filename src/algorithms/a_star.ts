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
// A* Pathfinding Pseudocode

function AStar(start, goal):
    openSet := {start}
    cameFrom := empty map
    gScore[start] := 0
    fScore[start] := heuristic(start, goal)

    while openSet is not empty:
        current := node in openSet with lowest fScore[]
        if current = goal:
            return reconstruct_path(cameFrom, current)

        remove current from openSet
        for each neighbor of current:
            tentative_gScore := gScore[current] + dist(current, neighbor)
            if tentative_gScore < gScore[neighbor]:
                cameFrom[neighbor] := current
                gScore[neighbor] := tentative_gScore
                fScore[neighbor] := gScore[neighbor] + heuristic(neighbor, goal)
                if neighbor not in openSet:
                    add neighbor to openSet

    return failure
`;

/**
 * Performs the A* pathfinding algorithm on a 2D grid.
 *
 * @param __grid - A 2D array representing the grid; each cell holds data about walls, etc.
 * @param setGrid - Setter function to update the grid.
 * @returns An array of Coordinates representing the shortest path from start to end,
 *          or an empty array if no path is found.
 */
export const aStar = async (
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

  // gScore stores the cost of the cheapest path from start to each cell
  const gScore: number[][] = createPopulatedGrid(numRows, numCols, Infinity);
  gScore[start.row][start.col] = 0;

  // fScore estimates the total cost from start to end passing through each cell
  const fScore: number[][] = createPopulatedGrid(numRows, numCols, Infinity);
  fScore[start.row][start.col] = manhattanHeuristic(start, end);

  const prev: (Coordinate | null)[][] = createPopulatedGrid(
    numRows,
    numCols,
    null
  );

  // The set of discovered nodes that may need to be re-evaluated
  const openSet: Coordinate[] = [start];

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
    const localGrid = __grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));
    localGrid[current.row][current.col].isVisiting = true;
    setGrid(localGrid);
    await sleep(100); // sleeps for 0.1 second

    // If we've reached the goal, reconstruct and return the path
    if (grid[current.row][current.col].isEnd) break;

    // Remove the current node from openSet
    openSet.splice(currentIndex, 1);

    // Explore neighbors of the current node
    for (const neighbor of getNeighbors(current, grid)) {
      const { row: newRow, col: newCol } = neighbor;
      const tentativeG = gScore[current.row][current.col] + 1;

      if (tentativeG < gScore[newRow][newCol]) {
        // This path to neighbor is better than any previous one
        gScore[newRow][newCol] = tentativeG;
        fScore[newRow][newCol] = tentativeG + manhattanHeuristic(neighbor, end);

        // If neighbor is not already in openSet, add it
        if (!openSet.some((n) => n.row === newRow && n.col === newCol)) {
          prev[newRow][newCol] = current;
          openSet.push(neighbor);
        }
      }
    }
  }

  // No path was found
  return reconstructPath(prev, start, end);
};



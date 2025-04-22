import { Coordinate, GridType } from "@/constants/grid";

import { aStar } from "./a_star"; // adjust the path if needed

function createGrid(
  rows: number,
  cols: number,
  walls: Coordinate[] = []
): GridType {
  const grid: GridType = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isStart: false,
      isEnd: false,
      isWall: false,
    }))
  );

  walls.forEach(({ row, col }) => {
    grid[row][col].isWall = true;
  });

  return grid;
}

describe("aStar", () => {
  it("finds a straight path in an empty 3x3 grid", async () => {
    const grid = createGrid(3, 3);
    const start: Coordinate = { row: 0, col: 0 };
    const end: Coordinate = { row: 0, col: 2 };

    const path = await aStar(grid, start, end, (grid: GridType) => {});

    expect(path).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
  });

  it("returns an empty path when path is blocked by walls", async () => {
    const walls = [
      { row: 0, col: 1 },
      { row: 1, col: 0 },
    ];
    const grid = createGrid(2, 2, walls);
    const start: Coordinate = { row: 0, col: 0 };
    const end: Coordinate = { row: 1, col: 1 };

    const path = await aStar(grid, start, end, (grid: GridType) => {});

    expect(path).toEqual([]);
  });

  it("returns a single node path when start and end are the same", async () => {
    const grid = createGrid(1, 1);
    const start: Coordinate = { row: 0, col: 0 };
    const end: Coordinate = { row: 0, col: 0 };

    const path = await aStar(grid, start, end, (grid: GridType) => {});

    expect(path).toEqual([{ row: 0, col: 0 }]);
  });

  it("avoids walls and finds a longer path", async () => {
    const walls = [{ row: 0, col: 1 }];
    const grid = createGrid(2, 3, walls);
    const start: Coordinate = { row: 0, col: 0 };
    const end: Coordinate = { row: 0, col: 2 };

    const path = await aStar(grid, start, end, (grid: GridType) => {});

    expect(path).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 0, col: 2 },
    ]);
  });
});

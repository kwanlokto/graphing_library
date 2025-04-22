export type CellType = {
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
};

export type GridType = CellType[][];

export type Coordinate = { row: number; col: number };


export const createEmptyGrid = (numRows: number, numCols: number): GridType => {
    const grid = [];
    for (let row = 0; row < numRows; row++) {
      const currentRow = [];
      for (let col = 0; col < numCols; col++) {
        currentRow.push({ isStart: false, isEnd: false, isWall: false });
      }
      grid.push(currentRow);
    }
    grid[0][0].isStart = true;
    grid[19][19].isEnd = true;
    return grid;
  }
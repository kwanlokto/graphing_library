export type CellType = {
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
};

export type GridType = CellType[][];

export type Coordinate = { row: number; col: number };

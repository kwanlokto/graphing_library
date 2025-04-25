export type CellType = {
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisiting?: boolean;
  isPath?: boolean;
};

export type GridType = CellType[][];

export type Coordinate = { row: number; col: number };

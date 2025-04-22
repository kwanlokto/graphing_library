import React, { useState } from "react";

import { Box } from "@mui/material";

interface GridProps {
  numRows: number;
  numCols: number;
}
const Grid = ({ numRows, numCols }: GridProps) => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [isMouseDown, setIsMouseDown] = useState(false);
  function createEmptyGrid() {
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

  const handleMouseDown = (row: number, col: number) => {
    const newGrid = [...grid];
    if (newGrid[row][col].isStart || newGrid[row][col].isEnd) return;

    newGrid[row][col].isWall = !newGrid[row][col].isWall;
    setGrid(newGrid);
    setIsMouseDown(true);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(20, 40px)",
        gridTemplateRows: "repeat(20, 40px)",
      }}
    >
      {grid.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <Box
            key={`${rowIdx}-${colIdx}`}
            sx={{
              width: 40,
              height: 40,
              backgroundColor: cell.isStart
                ? "green"
                : cell.isEnd
                ? "red"
                : cell.isWall
                ? "black"
                : "white",
              border: "1px solid #ccc",
              cursor: "pointer",
              display: "inline-block",
              "&:hover": {
                backgroundColor: cell.isWall ? "black" : "#e0e0e0",
              },
            }}
            onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
            onMouseEnter={() => {
              if (isMouseDown) handleMouseDown(rowIdx, colIdx);
            }}
            onMouseUp={() => setIsMouseDown(false)}
          />
        ))
      )}
    </Box>
  );
};

export default Grid;

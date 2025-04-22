import { Coordinate, GridType } from "@/constants/grid";
import React, { useState } from "react";

import { Box } from "@mui/material";

interface GridProps {
  grid: GridType;
  setGrid: (grid: GridType) => void;
  setStart: (end: Coordinate) => void;
  setEnd: (end: Coordinate) => void;
}
const Grid = ({ grid, setGrid, setStart, setEnd }: GridProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);

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
                ? "#1976d2" // Start: MUI Primary Blue
                : cell.isEnd
                ? "#d32f2f" // End: MUI Secondary Red
                : cell.isWall
                ? "#9e9e9e" // Wall: MUI Grey
                : cell.isVisiting
                ? "#ffeb3b" // Visiting: MUI Yellow
                : cell.isPath
                ? "#00796b" // Path: MUI Teal
                : "#e3f2fd", // Empty/Unvisited: MUI Light Blue Grey
              border: "1px solid #ccc", // Soft border
              cursor: "pointer",
              display: "inline-block",
              "&:hover": {
                backgroundColor: cell.isWall ? "#616161" : "#bbdefb", // Lighter on hover
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

import { Box, Button, ButtonGroup } from "@mui/material";
import { Coordinate, GridType } from "@/constants/grid";
import React, { useState } from "react";

interface GridProps {
  grid: GridType;
  setGrid: (grid: GridType) => void;
  setStart: (end: Coordinate) => void;
  setEnd: (end: Coordinate) => void;
}
const Grid = ({ grid, setGrid, setStart, setEnd }: GridProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [editMode, setEditMode] = useState<"start" | "end" | "wall">("wall");

  const handleMouseDown = (row: number, col: number) => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({ ...cell, isStart: cell.isStart, isEnd: cell.isEnd }))
    );

    const cell = newGrid[row][col];

    if (editMode === "start") {
      // Remove old start
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[r].length; c++) {
          newGrid[r][c].isStart = false;
        }
      }
      cell.isStart = true;
      setStart({ row, col });
    } else if (editMode === "end") {
      // Remove old end
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[r].length; c++) {
          newGrid[r][c].isEnd = false;
        }
      }
      cell.isEnd = true;
      setEnd({ row, col });
    } else if (editMode === "wall" && !cell.isStart && !cell.isEnd) {
      cell.isWall = !cell.isWall;
    }

    setGrid(newGrid);
    setIsMouseDown(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        gap: 3,
      }}
    >
      <ButtonGroup sx={{ mb: 2 }}>
        <Button
          variant={editMode === "start" ? "contained" : "outlined"}
          onClick={() => setEditMode("start")}
        >
          Set Start
        </Button>
        <Button
          variant={editMode === "end" ? "contained" : "outlined"}
          onClick={() => setEditMode("end")}
        >
          Set End
        </Button>
        <Button
          variant={editMode === "wall" ? "contained" : "outlined"}
          onClick={() => setEditMode("wall")}
        >
          Draw Walls
        </Button>
      </ButtonGroup>
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
    </Box>
  );
};

export default Grid;

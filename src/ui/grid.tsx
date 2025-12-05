import { Box, Button, ButtonGroup, useMediaQuery } from "@mui/material";
import { CellType, GridType } from "@/types/grid";
import React, { useState } from "react";

import { randomlyPlaceWalls } from "@/algorithms/helper";

interface GridProps {
  grid: GridType;
  setGrid: (grid: GridType) => void;
  disabled: boolean;
}

const getCellBgColor = (cell: CellType) => {
  return cell.isStart
    ? "#1976d2"
    : cell.isEnd
    ? "#d32f2f"
    : cell.isWall
    ? "#9e9e9e"
    : cell.isVisiting
    ? "#ffeb3b"
    : cell.isPath
    ? "#00796b"
    : "#e3f2fd";
};

const Grid = ({ grid, setGrid, disabled }: GridProps) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [editMode, setEditMode] = useState<"start" | "end" | "wall">("wall");

  const isMobile = useMediaQuery("(max-width: 900px)");

  const handleMouseDown = (row: number, col: number) => {
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newGrid[row][col];

    if (editMode === "start") {
      newGrid.forEach((r) => r.forEach((c) => (c.isStart = false)));
      cell.isStart = true;
    } else if (editMode === "end") {
      newGrid.forEach((r) => r.forEach((c) => (c.isEnd = false)));
      cell.isEnd = true;
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
        flexDirection: { xs: "column", md: "row" },
        gap: 3,
        width: "100%",
      }}
    >
      {/* CONTROLS */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: { xs: "100%", md: "200px" },
          gap: 2,
        }}
      >
        {/* Button Group */}
        <ButtonGroup
          fullWidth
          orientation={isMobile ? "horizontal" : "vertical"}
          variant="outlined"
          disabled={disabled}
        >
          <Button
            variant={editMode === "start" ? "contained" : "outlined"}
            onClick={() => setEditMode("start")}
          >
            Start
          </Button>

          <Button
            variant={editMode === "end" ? "contained" : "outlined"}
            onClick={() => setEditMode("end")}
          >
            End
          </Button>

          <Button
            variant={editMode === "wall" ? "contained" : "outlined"}
            onClick={() => setEditMode("wall")}
          >
            Walls
          </Button>
        </ButtonGroup>

        <Button
          fullWidth
          variant="contained"
          color="secondary"
          disabled={disabled}
          onClick={() => {
            const updatedGrid = randomlyPlaceWalls(grid, 20);
            setGrid(updatedGrid);
          }}
        >
          +20% Walls
        </Button>
      </Box>

      {/* RESPONSIVE GRID */}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "600px",
          aspectRatio: "1 / 1",
          display: "grid",
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
        }}
        onMouseLeave={() => setIsMouseDown(false)}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <Box
              key={`${rowIdx}-${colIdx}`}
              sx={{
                width: "100%",
                aspectRatio: "1/1",
                backgroundColor: getCellBgColor(cell),
                border: "1px solid #ccc",
                cursor: "pointer",
                ...(!disabled && {
                  "&:hover": {
                    backgroundColor: cell.isWall ? "#616161" : "#bbdefb",
                  },
                }),
              }}
              onMouseDown={() => !disabled && handleMouseDown(rowIdx, colIdx)}
              onMouseEnter={() => {
                if (isMouseDown && !disabled) handleMouseDown(rowIdx, colIdx);
              }}
              onMouseUp={() => !disabled && setIsMouseDown(false)}
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Grid;

import { Box, Button, ButtonGroup } from "@mui/material";
import { CellType, Coordinate, GridType } from "@/types/grid";
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

  const handleMouseDown = (row: number, col: number) => {
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

    const cell = newGrid[row][col];

    if (editMode === "start") {
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[r].length; c++) {
          newGrid[r][c].isStart = false;
        }
      }
      cell.isStart = true;
    } else if (editMode === "end") {
      for (let r = 0; r < newGrid.length; r++) {
        for (let c = 0; c < newGrid[r].length; c++) {
          newGrid[r][c].isEnd = false;
        }
      }
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
        flexDirection: "row", // vertical on small, horizontal on medium+
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      {/* Button Group */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: { xs: "center", md: "flex-start" },
          mb: { xs: 2, md: 0 },
          width: "100%",
          gap: 8,
        }}
      >
        <ButtonGroup
          fullWidth
          orientation={
            typeof window !== "undefined" && window.innerWidth < 900
              ? "horizontal"
              : "vertical"
          }
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
            const updatedGrid = randomlyPlaceWalls(grid, 20); // 20% density for walls
            setGrid(updatedGrid);
          }}
        >
          +20% Walls
        </Button>
      </Box>

      {/* Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(20, 40px)",
          gridTemplateRows: "repeat(20, 40px)",
        }}
        onMouseLeave={() => setIsMouseDown(false)}
      >
        {grid.map((row, rowIdx) =>
          row.map((cell, colIdx) => (
            <Box
              key={`${rowIdx}-${colIdx}`}
              sx={{
                width: 40,
                height: 40,
                backgroundColor: getCellBgColor(cell),
                border: "1px solid #ccc",
                cursor: "pointer",
                display: "inline-block",
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

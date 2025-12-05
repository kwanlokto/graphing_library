import { Box, Button, ButtonGroup, useMediaQuery } from "@mui/material";
import { CellType, GridType } from "@/types/grid";
import React, { useRef, useState } from "react";

import { randomlyPlaceWalls } from "@/algorithms/helper";

interface GridProps {
  grid: GridType;
  setGrid: React.Dispatch<React.SetStateAction<GridType>>;
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
  const [editMode, setEditMode] = useState<"start" | "end" | "wall">("wall");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const lastTouchedRef = useRef<{ r: number; c: number } | null>(null);
  const initialWallPaintValueRef = useRef<boolean | null>(null); // for toggle-on-drag behavior

  const isMobile = useMediaQuery("(max-width: 900px)");

  // Helper to deep-clone grid and edit safely
  const cloneGrid = (fn: (g: GridType) => GridType) => {
    setGrid((prev: GridType) => {
      const copy = prev.map((r) => r.map((c) => ({ ...c })));
      return fn(copy);
    });
  };

  // Compute row/col from clientX/clientY relative to the grid container
  const getCellFromPoint = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container || !grid?.length || !grid[0]?.length) return null;
    const rect = container.getBoundingClientRect();

    // clamp inside rect
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width - 1));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height - 1));

    const cols = grid[0].length;
    const rows = grid.length;

    const colWidth = rect.width / cols;
    const rowHeight = rect.height / rows;

    const c = Math.floor(x / colWidth);
    const r = Math.floor(y / rowHeight);

    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return { r, c };
  };

  // For walls: on initial press toggle the cell, remember targetValue so drag uses consistent value
  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;

    // prevent default behavior (scroll/zoom)
    e.preventDefault();

    // capture the pointer on the container to receive move/up reliably
    const container = containerRef.current;
    if (container) {
      try {
        (e.target as Element).setPointerCapture(e.pointerId);
      } catch {
        // some browsers require capturing on container; try there too
        try {
          container.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    }

    pointerIdRef.current = e.pointerId;

    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    lastTouchedRef.current = cell;

    if (editMode === "start") {
      // move start to this cell
      cloneGrid((g) => {
        g.forEach((row) => row.forEach((c) => (c.isStart = false)));
        g[cell.r][cell.c].isStart = true;
        // ensure it's not also a wall
        g[cell.r][cell.c].isWall = false;
        return g;
      });
    } else if (editMode === "end") {
      cloneGrid((g) => {
        g.forEach((row) => row.forEach((c) => (c.isEnd = false)));
        g[cell.r][cell.c].isEnd = true;
        g[cell.r][cell.c].isWall = false;
        return g;
      });
    } else if (editMode === "wall") {
      // On tap-down, toggle the wall state — store the new target so dragging paints same value
      const currentIsWall = grid[cell.r][cell.c].isWall;
      const newVal = !currentIsWall;
      initialWallPaintValueRef.current = newVal;
      cloneGrid((g) => {
        // don't toggle start/end cells
        if (!g[cell.r][cell.c].isStart && !g[cell.r][cell.c].isEnd) {
          g[cell.r][cell.c].isWall = newVal;
        }
        return g;
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (disabled) return;
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) {
      // ignoring other pointers
      return;
    }
    // only proceed if we have captured pointer (or pointerIdRef set)
    if (pointerIdRef.current === null) return;

    const cell = getCellFromPoint(e.clientX, e.clientY);
    if (!cell) return;

    const last = lastTouchedRef.current;
    if (last && last.r === cell.r && last.c === cell.c) return; // already processed

    lastTouchedRef.current = cell;

    if (editMode === "start") {
      cloneGrid((g) => {
        g.forEach((row) => row.forEach((c) => (c.isStart = false)));
        g[cell.r][cell.c].isStart = true;
        g[cell.r][cell.c].isWall = false;
        return g;
      });
    } else if (editMode === "end") {
      cloneGrid((g) => {
        g.forEach((row) => row.forEach((c) => (c.isEnd = false)));
        g[cell.r][cell.c].isEnd = true;
        g[cell.r][cell.c].isWall = false;
        return g;
      });
    } else if (editMode === "wall") {
      const target = initialWallPaintValueRef.current;
      // If for some reason we don't have an initial value, default to true (paint)
      const paint = target === null ? true : target;
      cloneGrid((g) => {
        if (!g[cell.r][cell.c].isStart && !g[cell.r][cell.c].isEnd) {
          g[cell.r][cell.c].isWall = paint;
        }
        return g;
      });
    }
  };

  const handlePointerUp = (e?: React.PointerEvent) => {
    // release pointer capture (if possible)
    const container = containerRef.current;
    if (container && pointerIdRef.current !== null) {
      try {
        (e?.target as Element)?.releasePointerCapture(pointerIdRef.current);
      } catch {
        try {
          container.releasePointerCapture(pointerIdRef.current);
        } catch {
          // ignore
        }
      }
    }

    pointerIdRef.current = null;
    lastTouchedRef.current = null;
    initialWallPaintValueRef.current = null;
  };

  // Helper to render cells (visual only — interactions handled by container)
  // We still render each cell so coloring/hover styles work.
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

      {/* GRID (single pointer handlers on container) */}
      <Box
        ref={containerRef}
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "600px",
          aspectRatio: "1 / 1",
          display: "grid",
          gridTemplateColumns: `repeat(${grid[0]?.length}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          touchAction: "none", // allow touch dragging
          // userSelect: "none" can help avoid accidental text selection
          userSelect: "none",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onContextMenu={(e) => e.preventDefault()}
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
                // provide hover visual (non-destructive)
                ...(!disabled && {
                  "&:hover": {
                    backgroundColor: cell.isWall ? "#616161" : "#bbdefb",
                  },
                }),
              }}
              // no per-cell pointer handlers required
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Grid;

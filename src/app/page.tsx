"use client";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Coordinate, createEmptyGrid } from "@/constants/grid";
import React, { useState } from "react";

import Grid from "../ui/Grid";
import { aStar } from "../algorithms/a_star";

const Home = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [grid, setGrid] = useState(createEmptyGrid(20, 20));
  const [isPathFound, setIsPathFound] = useState(false);
  const startPathfinding = async () => {
    setIsRunning(true);
    // Choose algorithm here (A* or Dijkstra)
    const localGrid = grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));
    const foundPath = await aStar(
      grid,
      { row: 0, col: 0 },
      { row: 19, col: 19 },
      setGrid
    );
    if (foundPath.length > 0) {
      setIsPathFound(true);
      foundPath.forEach((coordinate: Coordinate) => {
        localGrid[coordinate.row][coordinate.col].isPath = true;
      });
    }
    setGrid(localGrid);
    setIsRunning(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Stack spacing={2} alignItems="center" sx={{ width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={startPathfinding}
          disabled={isRunning}
          sx={{
            width: 200,
            borderRadius: 2,
            padding: "10px 20px",
            boxShadow: 2,
            "&:hover": { boxShadow: 4 },
          }}
        >
          {isRunning ? <CircularProgress size={24} /> : "Start Pathfinding"}
        </Button>

        {/* Grid Component */}
        <Grid grid={grid} setGrid={setGrid} />

        {/* Display the "Path Found" message */}
        {isPathFound && (
          <Typography
            variant="h6"
            sx={{
              marginTop: 2,
              color: "green",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Path Found!
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Home;

"use client";

import { Box, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";

import Grid from "../ui/Grid";
import { aStar } from "../algorithms/a_star";
import { createEmptyGrid } from "@/constants/grid";

const Home = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [path, setPath] = useState([]);
  const [grid, setGrid] = useState(createEmptyGrid(20, 20));

  const startPathfinding = () => {
    setIsRunning(true);
    const grid = createEmptyGrid(20, 20); // Get the grid from your state
    const start = [0, 0]; // Start position
    const end = [19, 19]; // End position

    // Choose algorithm here (A* or Dijkstra)
    const foundPath = aStar(grid, start, end);
    setPath(foundPath);
    setIsRunning(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={startPathfinding}
        disabled={isRunning}
        sx={{ width: 200 }}
      >
        {isRunning ? <CircularProgress size={24} /> : "Start Pathfinding"}
      </Button>
      <Grid grid={grid} setGrid={setGrid} />
      {path.length > 0 && <Box sx={{ marginTop: 2 }}>Path Found!</Box>}
    </Box>
  );
};

export default Home;

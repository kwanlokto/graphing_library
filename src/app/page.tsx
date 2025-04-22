"use client";

import { Box, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { a_star, dijkstra } from "../algorithms/pathfinding";

import Grid from "../ui/Grid";

const Home = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [path, setPath] = useState([]);

  const startPathfinding = () => {
    setIsRunning(true);
    const grid = createEmptyGrid(); // Get the grid from your state
    const start = [0, 0]; // Start position
    const end = [19, 19]; // End position

    // Choose algorithm here (A* or Dijkstra)
    const foundPath = a_star(grid, start, end);
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
      <Grid />
      {path.length > 0 && <Box sx={{ marginTop: 2 }}>Path Found!</Box>}
    </Box>
  );
};

export default Home;

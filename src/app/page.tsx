"use client";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Coordinate, createEmptyGrid } from "@/constants/grid";
import React, { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";

import AlgorithmSelector from "@/ui/AlgorithmSelector";
import Grid from "@/ui/Grid";
import ThemeToggle from "@/ui/ThemeToggle";
import { aStar } from "../algorithms/a_star";
import { dijkstra } from "@/algorithms/dijkstra";

const App = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [grid, setGrid] = useState(createEmptyGrid(20, 20));
  const [isPathFound, setIsPathFound] = useState(false);
  const [start, setStart] = useState<Coordinate | null>(null);
  const [end, setEnd] = useState<Coordinate | null>(null);
  const [algorithm, setAlgorithm] = useState("aStar");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: isDarkMode ? "#90caf9" : "#1976d2",
          },
        },
      }),
    [isDarkMode]
  );

  const startPathfinding = async () => {
    if (!start || !end) {
      alert("Please select both start and end points.");
      return;
    }
    setIsRunning(true);

    const localGrid = grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));

    let foundPath: Coordinate[] = [];
    if (algorithm === "aStar") {
      foundPath = await aStar(grid, start, end, setGrid);
    } else if (algorithm === "dijkstra") {
      foundPath = await dijkstra(grid, start, end, setGrid);
    }

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
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: 2,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
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
          <AlgorithmSelector
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
          />
          <Grid
            grid={grid}
            setGrid={setGrid}
            setStart={setStart}
            setEnd={setEnd}
          />
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
          <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default App;

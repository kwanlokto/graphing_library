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

import AlgorithmSelector from "@/ui/algorithm_selector";
import Grid from "@/ui/grid";
import { IoMdPlayCircle } from "react-icons/io";
import ThemeToggle from "@/ui/theme_toggle";
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
        <Stack
          spacing={3}
          alignItems="center"
          sx={{
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            px: 18,
            py: 4,
            backgroundColor: (theme) => theme.palette.background.default,
          }}
        >
          {/* Top Row: Algorithm Selector and Theme Toggle */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <AlgorithmSelector
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
            />
            <ThemeToggle
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
            />
          </Stack>

          {/* Full-width Grid */}
          <Box sx={{ width: "100%" }}>
            <Grid
              grid={grid}
              setGrid={setGrid}
              setStart={setStart}
              setEnd={setEnd}
              disabled={isRunning}
            />
          </Box>
          {/* Bottom Row: Start Button and Path Status */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              onClick={startPathfinding}
              disabled={isRunning}
              startIcon={!isRunning ? <IoMdPlayCircle /> : null}
              sx={{
                minWidth: 200,
                borderRadius: 3,
                paddingY: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: 3,
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {isRunning ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Start Pathfinding"
              )}
            </Button>

            {isPathFound && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: "success.main",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                ✅ Path Found!
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default App;

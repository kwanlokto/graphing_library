"use client";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Coordinate, GridType } from "@/types/grid";
import { IoMdPlayCircle, IoMdRefresh } from "react-icons/io";
import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  createEmptyGrid,
  getRandomCoordinate,
  updateGridWithStartEnd,
} from "@/algorithms/helper";

import AlgorithmSelector from "@/ui/algorithm_selector";
import Grid from "@/ui/grid";
import ThemeToggle from "@/ui/theme_toggle";
import { aStar } from "../algorithms/a_star";
import { dijkstra } from "@/algorithms/dijkstra";

const App = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [grid, setGrid] = useState<GridType>([]);
  const [pathStatus, setPathStatus] = useState<string | null>(null);
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

  const initGrid = () => {
    setPathStatus(null);
    const localGrid = createEmptyGrid(20, 20);
    // Randomly generate start and end, ensuring they don't overlap
    const randomStart = getRandomCoordinate(20, 20);
    let randomEnd = getRandomCoordinate(20, 20);

    // Ensure start and end are not the same
    while (
      randomStart.row === randomEnd.row &&
      randomStart.col === randomEnd.col
    ) {
      randomEnd = getRandomCoordinate(20, 20);
    }

    // Update the start and end positions
    setStart(randomStart);
    setEnd(randomEnd);

    // Update the grid to reflect the new start and end positions
    const updatedGrid = updateGridWithStartEnd(
      localGrid,
      randomStart,
      randomEnd
    );
    setGrid(updatedGrid);
  };

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
      setPathStatus("Path Found!");
      foundPath.forEach((coordinate: Coordinate) => {
        localGrid[coordinate.row][coordinate.col].isPath = true;
      });
    } else {
      setPathStatus("Path Not Found!");
    }
    setGrid(localGrid);
    setIsRunning(false);
  };

  /**
   * On initial render initialize the grid
   */
  useEffect(() => {
    initGrid();
  }, []);

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
              disabled={isRunning || pathStatus !== null}
            />
          </Box>
          {/* Bottom Row: Start Button and Path Status */}
          <Stack direction="row" spacing={2} alignItems="center">
            {pathStatus === null ? (
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
            ) : (
              <Button
                variant="contained"
                color="secondary"
                onClick={initGrid}
                startIcon={<IoMdRefresh />} // Add a refresh icon
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
                Reload
              </Button>
            )}

            {pathStatus !== null && (
              <Typography
                variant="subtitle1"
                sx={{
                  color: "success.main",
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                {pathStatus}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default App;

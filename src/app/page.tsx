"use client";

import { Box, Stack } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import {
  createEmptyGrid,
  getRandomCoordinate,
  updateGridWithStartEnd,
} from "@/algorithms/helper";

import AlgorithmSelector from "@/ui/algorithm_selector";
import Grid from "@/ui/grid";
import { GridType } from "@/types/grid";
import { RunButton } from "@/ui/run_path_button";
import ThemeToggle from "@/ui/theme_toggle";

const App = () => {
  const [grid, setGrid] = useState<GridType>([]);
  const [disableGrid, setDisableGrid] = useState(false);
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
    setDisableGrid(false);
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

    // Update the grid to reflect the new start and end positions
    const updatedGrid = updateGridWithStartEnd(
      localGrid,
      randomStart,
      randomEnd
    );
    setGrid(updatedGrid);
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
            <Grid grid={grid} setGrid={setGrid} disabled={disableGrid} />
          </Box>

          <RunButton
            gridState={[grid, setGrid]}
            resetGrid={initGrid}
            algorithm={algorithm}
            setDisableGrid={setDisableGrid}
          />
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default App;

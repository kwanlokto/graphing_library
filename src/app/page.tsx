"use client";

import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  createEmptyGrid,
  getRandomCoordinate,
  updateGridWithStartEnd,
} from "@/algorithms/helper";

import AlgorithmSelector from "@/ui/algorithm_selector";
import Grid from "@/ui/grid";
import { GridType } from "@/types/grid";
import { RunButton } from "@/ui/run_path_button";

const App = () => {
  const [grid, setGrid] = useState<GridType>([]);
  const [disableGrid, setDisableGrid] = useState(false);
  const [algorithm, setAlgorithm] = useState("aStar");
  const [pathStatus, setPathStatus] = useState<string | null>(null);

  const initGrid = () => {
    setDisableGrid(false);
    setPathStatus(null);
    const localGrid = createEmptyGrid(15, 15);
    // Randomly generate start and end, ensuring they don't overlap
    const randomStart = getRandomCoordinate(15, 15);
    let randomEnd = getRandomCoordinate(15, 15);

    // Ensure start and end are not the same
    while (
      randomStart.row === randomEnd.row &&
      randomStart.col === randomEnd.col
    ) {
      randomEnd = getRandomCoordinate(15, 15);
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
    <>
      {/* Hero */}
      <Box sx={{ width: "100%", mb: { xs: 3, sm: 4 } }}>
        <Typography
          variant="h4"
          sx={{ color: "text.primary", mb: 0.5 }}
        >
          Visual Pathfinding
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Draw walls, set a start and end point, and watch how each search
          algorithm finds its way.
        </Typography>
      </Box>

      {/* Top Row: Algorithm Selector and Theme Toggle */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 0, sm: 2 }}
        justifyContent="space-between"
        sx={{ width: "100%" }}
        mb={2}
      >
        <AlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm} />

        <RunButton
          gridState={[grid, setGrid]}
          algorithm={algorithm}
          disabled={disableGrid}
          setDisableGrid={setDisableGrid}
          pathStatus={pathStatus}
          setPathStatus={setPathStatus}
        />
      </Stack>

      {/* Full-width Grid */}
      <Box sx={{ width: "100%" }}>
        <Grid
          grid={grid}
          setGrid={setGrid}
          disabled={disableGrid}
          setDisableGrid={setDisableGrid}
          resetGrid={initGrid}
          pathStatus={pathStatus}
          setPathStatus={setPathStatus}
        />
      </Box>
    </>
  );
};

export default App;

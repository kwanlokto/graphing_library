"use client";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";

import React from "react";

interface AlgorithmSelectorProps {
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithm,
  setAlgorithm,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={1} width="100%">
      <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
        Algorithm
      </Typography>
      <ButtonGroup sx={{ mb: 1, minHeight: 40 }} fullWidth>
        <Button
          variant={algorithm === "aStar" ? "contained" : "outlined"}
          onClick={() => setAlgorithm("aStar")}
        >
          A*
        </Button>
        <Button
          variant={algorithm === "dijkstra" ? "contained" : "outlined"}
          onClick={() => setAlgorithm("dijkstra")}
        >
          Dijkstra
        </Button>
        <Button
          variant={algorithm === "bfs" ? "contained" : "outlined"}
          onClick={() => setAlgorithm("bfs")}
        >
          BFS
        </Button>
        <Button
          variant={algorithm === "gbfs" ? "contained" : "outlined"}
          onClick={() => setAlgorithm("gbfs")}
        >
          Greedy BFS
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default AlgorithmSelector;

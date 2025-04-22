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
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <Typography variant="subtitle1" fontWeight={500}>
        Algorithm
      </Typography>
      <ButtonGroup sx={{ mb: 1 }}>
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
      </ButtonGroup>
    </Box>
  );
};

export default AlgorithmSelector;

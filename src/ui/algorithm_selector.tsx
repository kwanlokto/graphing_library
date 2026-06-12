"use client";

import { Box, Typography } from "@mui/material";

import React from "react";

interface AlgorithmSelectorProps {
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;
}

const options = [
  { key: "aStar", label: "A*" },
  { key: "dijkstra", label: "Dijkstra" },
  { key: "bfs", label: "BFS" },
  { key: "gbfs", label: "Greedy BFS" },
];

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithm,
  setAlgorithm,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={1} width="100%">
      <Typography
        variant="subtitle2"
        fontWeight={600}
        color="text.secondary"
        sx={{
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontSize: "0.75rem",
          height: { xs: "auto", sm: "28px" },
          display: "flex",
          alignItems: "center",
        }}
      >
        Algorithm
      </Typography>
      <Box
        sx={{
          display: "flex",
          gap: "2px",
          p: "3px",
          borderRadius: "12px",
          backgroundColor: "secondary.main",
          minHeight: 44,
        }}
      >
        {options.map((option) => {
          const selected = algorithm === option.key;
          return (
            <Box
              key={option.key}
              component="button"
              onClick={() => setAlgorithm(option.key)}
              sx={{
                flex: 1,
                border: "none",
                cursor: "pointer",
                borderRadius: "9px",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                fontWeight: 600,
                py: 1,
                px: 1,
                backgroundColor: selected ? "background.paper" : "transparent",
                color: selected ? "primary.main" : "text.secondary",
                boxShadow: selected
                  ? "0 1px 4px rgba(0, 0, 0, 0.12)"
                  : "none",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: selected ? "primary.main" : "text.primary",
                },
              }}
            >
              {option.label}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default AlgorithmSelector;

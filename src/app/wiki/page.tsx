// app/wiki/search-algorithms/page.tsx

"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import Link from "next/link";
import React from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { pseudocode as aStarPseudocode } from "@/algorithms/a_star";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

const searchAlgorithms = [
  // {
  //   name: "Linear Search",
  //   description:
  //     "Checks each element one by one until the target is found or the list ends.",
  // },
  // {
  //   name: "Binary Search",
  //   description:
  //     "Efficiently searches sorted lists by repeatedly halving the search space.",
  // },
  // {
  //   name: "Depth-First Search (DFS)",
  //   description:
  //     "Explores as far as possible along each branch before backtracking.",
  // },
  // {
  //   name: "Breadth-First Search (BFS)",
  //   description:
  //     "Explores all nodes at the current depth before moving to the next level.",
  // },
  {
    name: "A* Search",
    key: "a-star",
    description:
      "Finds the shortest path using heuristics to guide the search efficiently.",
    psudocode: aStarPseudocode,
  },
];

export default function SearchAlgorithmsPage() {
  return (
    <Box sx={{ px: 2, py: 6, mx: "auto" }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Search Algorithms
      </Typography>

      <Grid container spacing={4}>
        {searchAlgorithms.map((algo) => (
          <Grid size={12} key={algo.key}>
            <Card
              variant="outlined"
              sx={{
                transition: "0.3s",
                "&:hover": { boxShadow: 3 },
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {algo.name}
                </Typography>
                <Typography color="text.secondary">
                  {algo.description}
                </Typography>
                {algo.psudocode && (
                  <SyntaxHighlighter language="text" style={tomorrow}>
                    {algo.psudocode}
                  </SyntaxHighlighter>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={8} textAlign="center">
        <Button
          component={Link}
          href="/"
          variant="text"
          color="primary"
          size="small"
        >
          ← Back to Home
        </Button>
      </Box>
    </Box>
  );
}

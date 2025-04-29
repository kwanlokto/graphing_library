"use client";

import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import { Suspense, lazy, useState } from "react";

import Link from "next/link";
import React from "react";
import { pseudocode as aStarPseudocode } from "@/algorithms/a_star";
import { pseudocode as dijkstraPseudocode } from "@/algorithms/dijkstra";

const AlgorithmWikiCard = lazy(() => import("@/ui/algorithm_wiki_card")); // lazy-loaded component

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
    description: (
      <>
        A (A-Star) Search* is a widely used pathfinding and graph traversal
        algorithm that finds the shortest path between a start node and a goal
        node in a weighted graph. It improves on Dijkstra’s algorithm by using
        heuristics to guide the search, making it faster and more efficient in
        many scenarios
      </>
    ),
    pseudocode: aStarPseudocode,
  },
  {
    name: "Dijkstra",
    key: "dijkstra",
    description: (
      <>
        Dijkstra's Algorithm is a classic algorithm used in graph theory to find
        the shortest path from a starting node (source) to all other nodes in a
        weighted graph (a graph where edges have numerical weights or costs).
      </>
    ),
    pseudocode: dijkstraPseudocode,
  },
];

export default function SearchAlgorithmsPage() {
  const [index, setIndex] = useState(0);
  const [query, setQuery] = useState("");

  const filteredAlgorithms = searchAlgorithms.filter((algo) =>
    algo.name.toLowerCase().includes(query.toLowerCase())
  );

  const currentAlgo = filteredAlgorithms[index];

  const handleNext = () => {
    if (index < filteredAlgorithms.length - 1) setIndex(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <Box sx={{ px: 2, py: 6, mx: "auto", maxWidth: 800 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Algorithms
      </Typography>

      <Autocomplete
        fullWidth
        options={searchAlgorithms}
        getOptionLabel={(option) => option.name}
        value={currentAlgo || null}
        onChange={(event, newValue) => {
          const newIndex = filteredAlgorithms.findIndex(
            (algo) => algo.key === newValue?.key
          );
          setQuery(newValue?.name || "");
          setIndex(newIndex !== -1 ? newIndex : 0);
        }}
        inputValue={query}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue);
          setIndex(0);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search..."
            variant="outlined"
            margin="normal"
          />
        )}
      />

      <Suspense fallback={<Typography>Loading...</Typography>}>
        {currentAlgo ? (
          <AlgorithmWikiCard {...currentAlgo} />
        ) : (
          <Typography>No algorithms found.</Typography>
        )}
      </Suspense>

      <Box mt={2} display="flex" justifyContent="space-between">
        <IconButton onClick={handlePrev} disabled={index === 0}>
          <MdOutlineKeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNext}
          disabled={index >= filteredAlgorithms.length - 1}
        >
          <MdOutlineKeyboardArrowRight />
        </IconButton>
      </Box>

      <Box mt={8} textAlign="center">
        <Button component={Link} href="/" variant="text" color="primary">
          ← Back to Home
        </Button>
      </Box>
    </Box>
  );
}

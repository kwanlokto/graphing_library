"use client";

import {
  Autocomplete,
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import React, { Suspense, lazy, useState } from "react";

import { pseudocode as BFSPseudocode } from "@/algorithms/bfs";
import { pseudocode as GreedyBFSPseudocode } from "@/algorithms/greedy_bfs";
import { pseudocode as aStarPseudocode } from "@/algorithms/a_star";
import { pseudocode as dijkstraPseudocode } from "@/algorithms/dijkstra";

const AlgorithmWikiCard = lazy(() => import("@/ui/algorithm_wiki_card"));

const searchAlgorithms = [
  {
    name: "Breadth-First Search (BFS)",
    key: "bfs",
    description: (
      <>
        Breadth-First Search (BFS) is a graph traversal algorithm that explores
        nodes level by level. Starting from a given node (the "start" or
        "source"), BFS visits all neighboring nodes before moving on to their
        neighbors. This makes it ideal for finding the shortest path in an
        unweighted graph or grid, as it guarantees the shortest number of steps
        from the start to any reachable node.
      </>
    ),
    pseudocode: BFSPseudocode,
  },
  {
    name: "Greedy Best-First Search (BFS)",
    key: "greedy-bfs",
    description: (
      <>
        Greedy Best-First Search (Greedy BFS) is a heuristic search algorithm
        used to find a path from a starting node to a goal node in a graph. It
        is called "greedy" because it always selects the node that appears to be
        closest to the goal, based solely on a heuristic function h(n)
      </>
    ),
    pseudocode: GreedyBFSPseudocode,
  },
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
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState(searchAlgorithms[0].key);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Current algorithm object
  const currentAlgo =
    searchAlgorithms.find((a) => a.key === selectedKey) || null;

  // Index of the selected algorithm within filtered results
  const selectedIndex = searchAlgorithms.findIndex(
    (a) => a.key === selectedKey
  );

  const handleNext = () => {
    console.log(selectedIndex, searchAlgorithms.length);
    if (selectedIndex < searchAlgorithms.length - 1) {
      console.log(searchAlgorithms[selectedIndex + 1].key);
      setSelectedKey(searchAlgorithms[selectedIndex + 1].key);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedKey(searchAlgorithms[selectedIndex - 1].key);
    }
  };

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 3 },
        pb: 4,
        maxWidth: "100%",
        mx: "auto",
      }}
    >
      {/* Title */}
      <Typography
        variant={isMobile ? "h5" : "h3"}
        component="h1"
        align="center"
        gutterBottom
      >
        Algorithms
      </Typography>

      {/* Search Bar */}
      <Autocomplete
        fullWidth
        options={searchAlgorithms}
        getOptionLabel={(option) => option.name}
        value={currentAlgo}
        isOptionEqualToValue={(a, b) => a.key === b?.key}
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedKey(newValue.key);
            setQuery(newValue.name);
          }
        }}
        inputValue={query}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue);
          // Reset index after search
          const filteredAlgorithms = searchAlgorithms.filter((algo) =>
            algo.name.toLowerCase().includes(newInputValue.toLowerCase())
          );
          if (filteredAlgorithms.length > 0) {
            setSelectedKey(filteredAlgorithms[0].key);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search algorithms..."
            variant="outlined"
            margin="normal"
            size={isMobile ? "small" : "medium"}
          />
        )}
      />

      {/* Card */}
      <Suspense fallback={<Typography>Loading...</Typography>}>
        {currentAlgo ? (
          <AlgorithmWikiCard
            name={currentAlgo.name}
            description={currentAlgo.description}
            psuedocode={currentAlgo.pseudocode}
          />
        ) : (
          <Typography>No algorithms found.</Typography>
        )}
      </Suspense>

      {/* Navigation Buttons */}
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mt: 2, px: 1 }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={selectedIndex <= 0}
          size={isMobile ? "small" : "medium"}
        >
          <MdOutlineKeyboardArrowLeft size={isMobile ? 22 : 28} />
        </IconButton>

        <IconButton
          onClick={handleNext}
          disabled={selectedIndex >= searchAlgorithms.length - 1}
          size={isMobile ? "small" : "medium"}
        >
          <MdOutlineKeyboardArrowRight size={isMobile ? 22 : 28} />
        </IconButton>
      </Stack>
    </Box>
  );
}

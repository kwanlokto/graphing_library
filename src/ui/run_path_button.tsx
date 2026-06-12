import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Coordinate, GridType } from "@/types/grid";
import { Dispatch, SetStateAction, useState } from "react";

import { BFS } from "@/algorithms/bfs";
import { IoMdPlayCircle } from "react-icons/io";
import { aStar } from "@/algorithms/a_star";
import { dijkstra } from "@/algorithms/dijkstra";
import { greedyBestFirstSearch } from "@/algorithms/greedy_bfs";

interface RunButtonProps {
  gridState: [GridType, Dispatch<SetStateAction<GridType>>];
  algorithm: string;
  disabled: boolean;
  setDisableGrid: Dispatch<SetStateAction<boolean>>;
  pathStatus: string | null;
  setPathStatus: Dispatch<SetStateAction<string | null>>;
}

const buttonStyle = {
  minWidth: 175,
  minHeight: 44,
  fontSize: "0.95rem",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "22px",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
    opacity: 0.85,
  },
  transition: "opacity 0.15s ease",
};

export const RunButton = ({
  gridState,
  algorithm,
  disabled,
  setDisableGrid,
  pathStatus,
  setPathStatus,
}: RunButtonProps) => {
  const [grid, setGrid] = gridState;
  const [isRunning, setIsRunning] = useState(false);

  const startPathfinding = async () => {
    setDisableGrid(true);
    setIsRunning(true);

    const localGrid = grid.map((rowArr) => rowArr.map((cell) => ({ ...cell })));

    let foundPath: Coordinate[] = [];
    if (algorithm === "aStar") {
      foundPath = await aStar(grid, setGrid);
    } else if (algorithm === "dijkstra") {
      foundPath = await dijkstra(grid, setGrid);
    } else if (algorithm === "bfs") {
      foundPath = await BFS(grid, setGrid);
    } else if (algorithm === "gbfs") {
      foundPath = await greedyBestFirstSearch(grid, setGrid);
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

  return (
    <Stack direction="column" spacing={1} alignItems="end">
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color:
            pathStatus === "Path Found!"
              ? "#34c759"
              : pathStatus === "Path Not Found!"
              ? "#ff3b30"
              : "text.primary",
          letterSpacing: 0.2,
          height: { xs: "auto", sm: "28px" },
          display: "flex",
          alignItems: "center",
        }}
      >
        {pathStatus !== null ? pathStatus : ""}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={startPathfinding}
        disabled={isRunning || disabled}
        startIcon={!isRunning ? <IoMdPlayCircle /> : null}
        sx={buttonStyle}
      >
        {isRunning ? <CircularProgress size={24} color="inherit" /> : "Start"}
      </Button>
    </Stack>
  );
};

import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Coordinate, GridType } from "@/types/grid";
import { Dispatch, SetStateAction, useState } from "react";
import { IoMdPlayCircle, IoMdRefresh } from "react-icons/io";

import { BFS } from "@/algorithms/bfs";
import { aStar } from "@/algorithms/a_star";
import { dijkstra } from "@/algorithms/dijkstra";
import { greedyBestFirstSearch } from "@/algorithms/greedy_bfs";

interface RunButtonProps {
  gridState: [GridType, Dispatch<SetStateAction<GridType>>];
  resetGrid: () => void;
  algorithm: string;
  setDisableGrid: Dispatch<SetStateAction<boolean>>;
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
  resetGrid,
  algorithm,
  setDisableGrid,
}: RunButtonProps) => {
  const [grid, setGrid] = gridState;
  const [isRunning, setIsRunning] = useState(false);
  const [pathStatus, setPathStatus] = useState<string | null>(null);

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
          minHeight: { sm: "1.75rem" }, // adjust as needed to match font size
        }}
      >
        {pathStatus !== null ? pathStatus : ""}
      </Typography>

      {pathStatus === null ? (
        <Button
          variant="contained"
          color="primary"
          onClick={startPathfinding}
          disabled={isRunning}
          startIcon={!isRunning ? <IoMdPlayCircle /> : null}
          sx={buttonStyle}
        >
          {isRunning ? <CircularProgress size={24} color="inherit" /> : "Start"}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            resetGrid();
            setPathStatus(null);
          }}
          startIcon={<IoMdRefresh />} // Add a refresh icon
          sx={buttonStyle}
        >
          Reload
        </Button>
      )}
    </Stack>
  );
};

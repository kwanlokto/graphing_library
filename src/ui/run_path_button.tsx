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
  minHeight: 40,
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: 3,
  "&:hover": {
    boxShadow: 6,
    transform: "translateY(-1px)",
  },
  transition: "all 0.2s ease-in-out",
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
          color: "text.primary",
          letterSpacing: 0.5,
          minHeight: "1.75rem", // adjust as needed to match font size
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
          {isRunning ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Start"
          )}
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

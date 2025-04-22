import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import React from "react";

interface AlgorithmSelectorProps {
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  algorithm,
  setAlgorithm,
}) => {
  const handleAlgorithmChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setAlgorithm(event.target.value as string);
  };

  return (
    <FormControl fullWidth sx={{ width: 200 }}>
      <InputLabel id="algorithm-label">Algorithm</InputLabel>
      <Select
        labelId="algorithm-label"
        value={algorithm}
        label="Algorithm"
        onChange={handleAlgorithmChange}
      >
        <MenuItem value="aStar">A* Algorithm</MenuItem>
        <MenuItem value="dijkstra">Dijkstra Algorithm</MenuItem>
      </Select>
    </FormControl>
  );
};

export default AlgorithmSelector;

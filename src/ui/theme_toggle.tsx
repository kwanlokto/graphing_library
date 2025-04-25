import { FormControlLabel, Switch } from "@mui/material";

import React from "react";

interface ThemeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDarkMode,
  setIsDarkMode,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={isDarkMode}
          onChange={() => setIsDarkMode(!isDarkMode)}
          name="darkModeToggle"
          color="primary"
        />
      }
      label="Dark Mode"
      sx={{ color: "text.primary" }}
    />
  );
};

export default ThemeToggle;

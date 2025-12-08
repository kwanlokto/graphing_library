"use client";

import {
  Box,
  CssBaseline,
  Stack,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { FormControlLabel, Switch } from "@mui/material";
import { useMemo, useState } from "react";

import React from "react";

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mode = isDarkMode ? "dark" : "light";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "#fef8e7" : "#1a1a1a",
            paper: mode === "light" ? "#fffaf2" : "#242424",
          },
          text: {
            primary: mode === "light" ? "#0a1f2a" : "#e8e8e8",
            secondary: mode === "light" ? "#577683" : "#a8a8a8",
          },
          primary: {
            main: mode === "light" ? "#1a4d6b" : "#5aa5ff",
            light: mode === "light" ? "#2c6b8f" : "#85c0ff",
            dark: mode === "light" ? "#0d3449" : "#3a8eef",
          },
          secondary: {
            main: mode === "light" ? "#c8944d" : "#f0c595",
            light: mode === "light" ? "#ddb073" : "#ffdbba",
            dark: mode === "light" ? "#a67535" : "#d9a870",
          },
          divider: mode === "light" ? "#c9b895" : "#333333",
          action: {
            hover:
              mode === "light"
                ? "rgba(26, 77, 107, 0.10)"
                : "rgba(90, 165, 255, 0.12)",
            selected:
              mode === "light"
                ? "rgba(26, 77, 107, 0.16)"
                : "rgba(90, 165, 255, 0.16)",
          },
        },
      }),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          padding: 2,
          backgroundColor: theme.palette.background.default,
          minHeight: "100%",
        }}
      >
        <Stack
          alignItems="center"
          sx={{
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            px: { xs: 0, sm: 18 },
            py: { xs: 0, sm: 4 },
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={() => setIsDarkMode(!isDarkMode)}
                  name="darkModeToggle"
                  color="primary"
                />
              }
              labelPlacement="start"
              label="Dark Mode"
              sx={{ color: "text.primary" }}
            />
          </Box>
          {children}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

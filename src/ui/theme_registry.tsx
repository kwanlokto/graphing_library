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

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? "dark" : "light",
          primary: {
            main: isDarkMode ? "#90caf9" : "#1976d2",
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
          minHeight: "100vh",
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          sx={{
            maxWidth: "1280px",
            width: "100%",
            margin: "0 auto",
            px: 18,
            py: 4,
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

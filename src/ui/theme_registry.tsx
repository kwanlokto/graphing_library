"use client";

import {
  Box,
  CssBaseline,
  Stack,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useMemo, useState } from "react";

import NavBar from "@/ui/navbar";
import React from "react";

const appleFontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif';

export const ThemeRegistry = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const mode = isDarkMode ? "dark" : "light";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "#f5f5f7" : "#000000",
            paper: mode === "light" ? "#ffffff" : "#1c1c1e",
          },
          text: {
            primary: mode === "light" ? "#1d1d1f" : "#f5f5f7",
            secondary: mode === "light" ? "#6e6e73" : "#98989d",
          },
          primary: {
            main: mode === "light" ? "#0071e3" : "#0a84ff",
            light: mode === "light" ? "#2f9bff" : "#5ac8fa",
            dark: mode === "light" ? "#0058b8" : "#0060c0",
            contrastText: "#ffffff",
          },
          secondary: {
            main: mode === "light" ? "#e8e8ed" : "#2c2c2e",
            light: mode === "light" ? "#f5f5f7" : "#3a3a3c",
            dark: mode === "light" ? "#d2d2d7" : "#1c1c1e",
            contrastText: mode === "light" ? "#1d1d1f" : "#f5f5f7",
          },
          divider:
            mode === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.08)",
          action: {
            hover:
              mode === "light"
                ? "rgba(0, 113, 227, 0.06)"
                : "rgba(10, 132, 255, 0.10)",
            selected:
              mode === "light"
                ? "rgba(0, 113, 227, 0.10)"
                : "rgba(10, 132, 255, 0.16)",
          },
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: appleFontStack,
          h1: { fontWeight: 600, letterSpacing: "-0.02em" },
          h2: { fontWeight: 600, letterSpacing: "-0.02em" },
          h3: { fontWeight: 600, letterSpacing: "-0.015em" },
          h4: { fontWeight: 600, letterSpacing: "-0.01em" },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          button: { fontWeight: 600, textTransform: "none" },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                textTransform: "none",
                fontWeight: 600,
                boxShadow: "none",
                transition: "all 0.15s ease",
              },
              contained: {
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              },
              outlined: ({ theme }) => ({
                borderColor: theme.palette.divider,
              }),
            },
          },
          MuiButtonGroup: {
            styleOverrides: {
              root: {
                borderRadius: 10,
              },
              grouped: {
                borderRadius: 10,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: ({ theme }) => ({
                borderRadius: 18,
                border: `1px solid ${theme.palette.divider}`,
                boxShadow:
                  theme.palette.mode === "light"
                    ? "0 2px 24px rgba(0, 0, 0, 0.05)"
                    : "0 2px 24px rgba(0, 0, 0, 0.4)",
              }),
            },
          },
          MuiSwitch: {
            styleOverrides: {
              root: {
                width: 51,
                height: 31,
                padding: 0,
              },
              switchBase: {
                padding: 2,
                "&.Mui-checked": {
                  transform: "translateX(20px)",
                  color: "#fff",
                  "& + .MuiSwitch-track": {
                    backgroundColor: "#34c759",
                    opacity: 1,
                  },
                },
              },
              thumb: {
                width: 27,
                height: 27,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              },
              track: ({ theme }) => ({
                borderRadius: 31 / 2,
                backgroundColor:
                  theme.palette.mode === "light" ? "#e9e9ea" : "#39393d",
                opacity: 1,
                transition: "background-color 0.2s ease",
              }),
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: ({ theme }) => ({
                borderRadius: 10,
                backgroundColor:
                  theme.palette.mode === "light" ? "#f5f5f7" : "#1c1c1e",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor:
                    theme.palette.mode === "light"
                      ? "rgba(0, 0, 0, 0.1)"
                      : "rgba(255, 255, 255, 0.1)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 1,
                },
              }),
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100%",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box sx={{ width: "100%" }}>
          <NavBar
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          />
        </Box>
        <Stack
          alignItems="center"
          sx={{
            maxWidth: "1080px",
            width: "100%",
            margin: "0 auto",
            px: { xs: 2, sm: 4, md: 6 },
            py: { xs: 3, sm: 5 },
            backgroundColor: theme.palette.background.default,
          }}
        >
          {children}
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

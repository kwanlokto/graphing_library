"use client";

import React, { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import { MdMenu } from "react-icons/md";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: isDark
            ? "rgba(28, 28, 30, 0.72)"
            : "rgba(255, 255, 255, 0.72)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 52, sm: 52 } }}>
          {/* Left side brand */}
          <Typography
            variant="subtitle1"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              cursor: "pointer",
            }}
            component={Link}
            href="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Pathfinder
          </Typography>

          {/* Mobile menu button */}
          {isMobile ? (
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "text.primary" }}
            >
              <MdMenu />
            </IconButton>
          ) : (
            /* Desktop buttons */
            <Box>
              <Button
                component={Link}
                href="/wiki"
                sx={{
                  color: "text.primary",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                Wiki
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "background.paper",
              backgroundImage: "none",
            },
          },
        }}
      >
        <Box
          sx={{
            width: 180,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Button
            component={Link}
            href="/"
            onClick={() => setDrawerOpen(false)}
            sx={{ justifyContent: "flex-start", color: "text.primary" }}
          >
            Home
          </Button>
          <Button
            component={Link}
            href="/wiki"
            onClick={() => setDrawerOpen(false)}
            sx={{ justifyContent: "flex-start", color: "text.primary" }}
          >
            Wiki
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

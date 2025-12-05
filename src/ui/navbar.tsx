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

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* Left side brand */}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            component={Link}
            href="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Home
          </Typography>

          {/* Mobile menu button */}
          {isMobile ? (
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setDrawerOpen(true)}
            >
              <MdMenu />
            </IconButton>
          ) : (
            /* Desktop buttons */
            <Box>
              <Button color="inherit" component={Link} href="/wiki">
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
      >
        <Box
          sx={{
            width: 150,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            component={Link}
            href="/"
            onClick={() => setDrawerOpen(false)}
          >
            Home
          </Button>
          <Button
            component={Link}
            href="/wiki"
            onClick={() => setDrawerOpen(false)}
          >
            Wiki
          </Button>
        </Box>
      </Drawer>
    </>
  );
}

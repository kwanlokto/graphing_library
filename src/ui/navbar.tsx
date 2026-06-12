"use client";

import React, { useState } from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import { MdMenu } from "react-icons/md";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { usePathname } from "next/navigation";
import { useTheme } from "@mui/material/styles";

interface NavBarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Wiki", href: "/wiki" },
];

export default function NavBar({ isDarkMode, onToggleDarkMode }: NavBarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";
  const pathname = usePathname();

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
            Pathways
          </Typography>

          {/* Desktop nav links */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 0.5, mr: 1 }}>
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Button
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      color: active ? "primary.main" : "text.primary",
                      fontWeight: 500,
                      backgroundColor: active ? "action.selected" : "transparent",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Dark mode toggle */}
          <Switch
            checked={isDarkMode}
            onChange={onToggleDarkMode}
            size="small"
            name="darkModeToggle"
            inputProps={{ "aria-label": "Toggle dark mode" }}
          />

          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: "text.primary", ml: 0.5 }}
            >
              <MdMenu />
            </IconButton>
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
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Button
                key={link.href}
                component={Link}
                href={link.href}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  justifyContent: "flex-start",
                  color: active ? "primary.main" : "text.primary",
                  backgroundColor: active ? "action.selected" : "transparent",
                }}
              >
                {link.label}
              </Button>
            );
          })}
        </Box>
      </Drawer>
    </>
  );
}

// components/NavBar.tsx

"use client";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function NavBar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
        </Typography>

        <Box>
          <Button color="inherit" component={Link} href="/wiki">
            Wiki
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

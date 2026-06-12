"use client";

import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from "@mui/material";

import { ReactElement } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface AlgorithmCardProps {
  name: string;
  description: string | ReactElement;
  psuedocode?: string;
}

export default function AlgorithmWikiCard({
  name,
  description,
  psuedocode,
}: AlgorithmCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        mt: 3,
        overflow: "hidden",
        mx: "auto",
        width: "100%",
        maxWidth: 800,
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
        }}
      >
        {/* Title */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component="div"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {name}
        </Typography>

        {/* Description */}
        <Typography
          color="text.secondary"
          sx={{
            fontSize: isMobile ? "0.9rem" : "1rem",
            lineHeight: 1.5,
            mb: 2,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {description}
        </Typography>

        {/* Pseudocode */}
        {psuedocode && (
          <Box
            sx={{
              mt: 2,
              overflowX: "auto",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <SyntaxHighlighter
              language="text"
              style={theme.palette.mode === "dark" ? oneDark : oneLight}
              customStyle={{
                margin: 0,
                padding: isMobile ? "12px" : "16px",
                fontSize: isMobile ? "0.75rem" : "0.85rem",
              }}
              wrapLongLines={false}
            >
              {psuedocode}
            </SyntaxHighlighter>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

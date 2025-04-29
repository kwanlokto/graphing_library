"use client";

import { Card, CardContent, Typography } from "@mui/material";

import { ReactElement } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

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
  return (
    <Card
      variant="outlined"
      sx={{
        mt: 4,
        transition: "0.3s",
        "&:hover": { boxShadow: 3 },
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {name}
        </Typography>
        <Typography color="text.secondary">{description}</Typography>
        {psuedocode && (
          <SyntaxHighlighter language="text" style={tomorrow}>
            {psuedocode}
          </SyntaxHighlighter>
        )}
      </CardContent>
    </Card>
  );
}

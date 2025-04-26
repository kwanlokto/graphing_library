"use client"; // only for App Router

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { pseudocode as aStarPseudocode } from "@/algorithms/a_star";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useParams } from "next/navigation";

const PseudocodePage = () => {
  const params = useParams();
  const algorithm = params.algorithm;

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Pseudocode</h1>
      <SyntaxHighlighter language="text" style={tomorrow}>
        {algorithm === "a-star" ? aStarPseudocode : ""}
      </SyntaxHighlighter>
    </div>
  );
};

export default PseudocodePage;

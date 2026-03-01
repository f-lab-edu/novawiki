"use client";

import { diffWords } from "diff";
import { useMemo } from "react";

interface CompareWordHighlightProps {
  oldLine: string;
  newLine: string;
  side: "old" | "new";
}

export function CompareWordHighlight({
  oldLine,
  newLine,
  side,
}: CompareWordHighlightProps) {
  const wordDiff = useMemo(
    () => diffWords(oldLine, newLine),
    [oldLine, newLine],
  );

  return wordDiff.map((part, i) => {
    if (side === "old" && part.removed) {
      return (
        <span
          key={`${side}-${part.value}-${i}`}
          className="bg-red-200 dark:bg-red-900/50"
        >
          {part.value}
        </span>
      );
    }
    if (side === "new" && part.added) {
      return (
        <span
          key={`${side}-${part.value}-${i}`}
          className="bg-green-200 dark:bg-green-900/50"
        >
          {part.value}
        </span>
      );
    }
    if (!part.added && !part.removed) {
      return <span key={`${side}-${part.value}-${i}`}>{part.value}</span>;
    }
    return null;
  });
}

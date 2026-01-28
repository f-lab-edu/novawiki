'use client'

import "./diff.css";
import React from "react";
import { diffLines, diffWords } from "diff";

function highlightWordDiff(oldLine: string, newLine: string): React.ReactNode[] {
  const wordDiff = diffWords(oldLine, newLine);

  return wordDiff.map((part, i) => {
    if (part.added) {
      return (
        <span key={i} className="diff-word-added">
          {part.value}
        </span>
      );
    }
    if (part.removed) {
      return (
        <span key={i} className="diff-word-removed">
          {part.value}
        </span>
      );
    }
    return <span key={i}>{part.value}</span>;
  });
}

export default function WikiDiffViewer({ oldText, newText }: { oldText: string, newText: string }) {
  const lineDiff = diffLines(oldText, newText);

  const rows = [];
  let i = 0;

  while (i < lineDiff.length) {
    const part = lineDiff[i];

    // 변경된 줄 쌍 (삭제 후 추가)
    if (
      part.removed &&
      i + 1 < lineDiff.length &&
      lineDiff[i + 1].added
    ) {
      const removedLine = part.value;
      const addedLine = lineDiff[i + 1].value;

      rows.push(
        <div key={i} className="diff-line removed">
          {highlightWordDiff(removedLine, addedLine)}
        </div>
      );

      rows.push(
        <div key={i + 1} className="diff-line added">
          {highlightWordDiff(removedLine, addedLine)}
        </div>
      );

      i += 2;
      continue;
    }

    if (part.added) {
      rows.push(
        <div key={i} className="diff-line added">
          {part.value}
        </div>
      );
    } else if (part.removed) {
      rows.push(
        <div key={i} className="diff-line removed">
          {part.value}
        </div>
      );
    } else {
      rows.push(
        <div key={i} className="diff-line normal">
          {part.value}
        </div>
      );
    }

    i++;
  }

  return <div className="wiki-diff">{rows}</div>;
}
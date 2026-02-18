"use client";

import { diffLines } from "diff";
import type React from "react";
import { useMemo } from "react";
import { WordHighlight } from "./components/WordHighlight";

type DiffLine = {
  type: "added" | "removed" | "normal" | "modified";
  content: string;
  highlightedContent?: React.ReactNode;
};

export function WikiDiffer({
  oldText,
  newText,
  oldVersion,
  newVersion,
}: {
  oldText: string;
  newText: string;
  oldVersion: string;
  newVersion: string;
}) {
  const { oldLines, newLines, maxLines } = useMemo(() => {
    const lineDiff = diffLines(oldText, newText);

    const oldLines: DiffLine[] = [];
    const newLines: DiffLine[] = [];

    let i = 0;
    while (i < lineDiff.length) {
      const part = lineDiff[i];

      if (part.removed && i + 1 < lineDiff.length && lineDiff[i + 1].added) {
        const removedContent = part.value.replace(/\n$/, "");
        const addedContent = lineDiff[i + 1].value.replace(/\n$/, "");

        oldLines.push({
          type: "modified",
          content: removedContent,
          highlightedContent: (
            <WordHighlight
              oldLine={removedContent}
              newLine={addedContent}
              side="old"
            />
          ),
        });
        newLines.push({
          type: "modified",
          content: addedContent,
          highlightedContent: (
            <WordHighlight
              oldLine={removedContent}
              newLine={addedContent}
              side="new"
            />
          ),
        });

        i += 2;
        continue;
      }

      if (part.added) {
        oldLines.push({ type: "normal", content: "" });
        newLines.push({
          type: "added",
          content: part.value.replace(/\n$/, ""),
        });
      } else if (part.removed) {
        oldLines.push({
          type: "removed",
          content: part.value.replace(/\n$/, ""),
        });
        newLines.push({ type: "normal", content: "" });
      } else {
        const lines = part.value
          .split("\n")
          .filter((_, idx, arr) =>
            idx < arr.length - 1 || part.value.slice(-1) !== "\n"
              ? true
              : idx < arr.length - 1,
          );
        for (const line of lines) {
          oldLines.push({ type: "normal", content: line });
          newLines.push({ type: "normal", content: line });
        }
      }

      i++;
    }

    const maxLines = Math.max(oldLines.length, newLines.length);

    return { oldLines, newLines, maxLines };
  }, [oldText, newText]);

  return (
    <div className="flex gap-4">
      {/* 이전 버전 */}
      <div className="flex-1 min-w-0">
        <div className="rounded-lg border overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 font-medium border-b">
            {oldVersion}
          </div>
          <div className="font-mono text-sm">
            {Array.from({ length: maxLines }).map((_, idx) => {
              const line = oldLines[idx] || { type: "normal", content: "" };
              return (
                <div
                  key={`${oldVersion}-${idx}-${line.highlightedContent}`}
                  className={`px-4 py-1 min-h-6 whitespace-pre-wrap ${
                    line.type === "removed" || line.type === "modified"
                      ? "bg-red-50 dark:bg-red-950/30"
                      : ""
                  }`}
                >
                  {line.highlightedContent || line.content || "\u00A0"}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 현재 버전 */}
      <div className="flex-1 min-w-0">
        <div className="rounded-lg border overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 font-medium border-b">
            {newVersion}
          </div>
          <div className="font-mono text-sm">
            {Array.from({ length: maxLines }).map((_, idx) => {
              const line = newLines[idx] || { type: "normal", content: "" };
              return (
                <div
                  key={`${newVersion}-${idx}-${line.highlightedContent}`}
                  className={`px-4 py-1 min-h-6 whitespace-pre-wrap ${
                    line.type === "added" || line.type === "modified"
                      ? "bg-green-50 dark:bg-green-950/30"
                      : ""
                  }`}
                >
                  {line.highlightedContent || line.content || "\u00A0"}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

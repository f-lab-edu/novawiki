
export type DiffLineType = {
  type: "added" | "removed" | "normal" | "modified";
  content: string;
  highlightedContent?: React.ReactNode;
};
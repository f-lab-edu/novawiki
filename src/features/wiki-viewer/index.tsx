"use client";

import dynamic from "next/dynamic";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownPreview = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
});

export function WikiViewer({ content }: { content: string }) {
  return (
    <div data-color-mode="light">
      <MarkdownPreview source={content} />
    </div>
  );
}

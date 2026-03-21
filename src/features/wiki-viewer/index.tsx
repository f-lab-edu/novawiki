"use client";

import "@/packages/markdown-editor/core/styles/editor.css";
import { wikiLinkPlugin } from "@/lib/plugins/wikiLink";
import { MarkdownViewer } from "@/packages/markdown-editor/react/src";

export function WikiViewer({ content }: { content: string }) {
  return <MarkdownViewer content={content} plugins={[wikiLinkPlugin]} />;
}

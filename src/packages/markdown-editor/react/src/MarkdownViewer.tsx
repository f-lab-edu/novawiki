import { Viewer as CoreViewer } from "@f-wiki/markdown-editor";
import type { ParserPlugin } from "@f-wiki/markdown-parser";
import { useEffect, useRef } from "react";

export interface MarkdownViewerProps {
  content: string;
  plugins?: ParserPlugin[];
  urlFilter?: (url: string) => boolean;
  className?: string;
}

export function MarkdownViewer({
  content,
  plugins,
  urlFilter,
  className,
}: MarkdownViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CoreViewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const viewer = new CoreViewer(
      containerRef.current,
      plugins ?? [],
      urlFilter,
    );
    viewerRef.current = viewer;
    viewer.render(content);

    return () => {
      viewer.destroy();
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  useEffect(() => {
    viewerRef.current?.render(content);
  }, [content]);

  return <div ref={containerRef} className={className} />;
}

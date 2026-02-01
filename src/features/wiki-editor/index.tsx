"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// 에디터가 서버에서 렌더링될 수 없는 구조 -> ssr : false
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export function WikiEditor({ content }: { content: string }) {
  const [value, setValue] = useState<string | undefined>(content);
  return (
    <div>
      <MDEditor value={value} onChange={(val) => setValue(val)} height={400} />
    </div>
  );
}

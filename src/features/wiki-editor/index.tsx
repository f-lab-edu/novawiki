"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

// 에디터가 서버에서 렌더링될 수 없는 구조 -> ssr : false
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type WikiEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function WikiEditor({ value, onChange }: WikiEditorProps) {
  return (
    <div>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val ?? "")}
        height={400}
      />
    </div>
  );
}

"use client";

import "@/packages/markdown-editor/core/styles/editor.css";
import { uploadDocumentImage } from "@/lib/storage/uploadImage";
import { wikiLinkPlugin } from "@/lib/plugins/wikiLink";
import { MarkdownEditor } from "@/packages/markdown-editor/react/src";

type WikiEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => void;
};

export function WikiEditor({ value, onChange, onSave }: WikiEditorProps) {
  return (
    <MarkdownEditor
      value={value}
      onChange={onChange}
      onSave={onSave}
      height={400}
      plugins={[wikiLinkPlugin]}
      uploadImage={uploadDocumentImage}
    />
  );
}

import type { MarkdownEditorOptions } from "@f-wiki/markdown-editor";
import { MarkdownEditor as CoreEditor } from "@f-wiki/markdown-editor";
import { useEffect, useRef } from "react";

export interface MarkdownEditorProps extends MarkdownEditorOptions {
  className?: string;
}

export function MarkdownEditor({
  className,
  value,
  onChange,
  onSave,
  height,
  placeholder,
  plugins,
  urlFilter,
  uploadImage,
}: MarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<CoreEditor | null>(null);
  const onChangeRef = useRef(onChange);
  const onSaveRef = useRef(onSave);

  // 콜백 ref 최신화 (editor 재생성 없이)
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // 에디터 마운트
  useEffect(() => {
    if (!containerRef.current) return;

    const editor = new CoreEditor(containerRef.current, {
      value,
      onChange: (v) => onChangeRef.current?.(v),
      onSave: (v) => onSaveRef.current?.(v),
      height,
      placeholder,
      plugins,
      urlFilter,
      uploadImage,
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  // 외부에서 value가 변경되면 에디터에 반영
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (value !== undefined && editor.getValue() !== value) {
      editor.setValue(value);
    }
  }, [value]);

  return <div ref={containerRef} className={className} />;
}

import { registerShortcuts } from "./shortcuts";
import { createToolbar } from "./Toolbar";
import type { MarkdownEditorOptions } from "./types";
import { Viewer } from "./Viewer";

function debounce<T extends unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export class MarkdownEditor {
  private root: HTMLElement;
  private textarea: HTMLTextAreaElement;
  private viewer: Viewer;
  private cleanupShortcuts: () => void;
  private options: MarkdownEditorOptions;

  constructor(container: HTMLElement, options: MarkdownEditorOptions = {}) {
    this.options = options;
    this.root = container;
    this.root.classList.add("md-editor");

    // ─── Textarea ─────────────────────────────────────────────────────────────
    const textarea = document.createElement("textarea");
    textarea.className =
      "md-textarea w-1/2 h-full resize-none border-r p-3 font-mono text-sm leading-relaxed focus:outline-none";
    textarea.placeholder = options.placeholder ?? "내용을 입력하세요.";
    textarea.value = options.value ?? "";
    this.textarea = textarea;

    // ─── 툴바 ─────────────────────────────────────────────────────────────────
    createToolbar(this.root, textarea, options);

    // ─── 에디터 영역 ──────────────────────────────────────────────────────────
    const editorArea = document.createElement("div");
    editorArea.className = "md-editor-area flex";
    editorArea.style.height = `${options.height ?? 400}px`;

    // ─── 미리보기 컨테이너 ────────────────────────────────────────────────────
    const previewContainer = document.createElement("div");
    previewContainer.className = "md-preview w-1/2 h-full overflow-y-auto p-4";

    this.viewer = new Viewer(
      previewContainer,
      options.plugins ?? [],
      options.urlFilter,
    );

    // 초기 렌더링
    this.viewer.render(textarea.value);

    // ─── 입력 이벤트 (100ms debounce) ────────────────────────────────────────
    const debouncedRender = debounce((value: string) => {
      this.viewer.render(value);
    }, 100);

    textarea.addEventListener("input", () => {
      options.onChange?.(textarea.value);
      debouncedRender(textarea.value);
    });

    // ─── 스크롤 동기화 ────────────────────────────────────────────────────────
    textarea.addEventListener("scroll", () => {
      const scrollRatio =
        textarea.scrollTop /
        Math.max(1, textarea.scrollHeight - textarea.clientHeight);
      previewContainer.scrollTop =
        scrollRatio *
        (previewContainer.scrollHeight - previewContainer.clientHeight);
    });

    // ─── 단축키 ──────────────────────────────────────────────────────────────
    this.cleanupShortcuts = registerShortcuts(textarea, {
      onSave: options.onSave,
    });

    // ─── DOM 조립 ─────────────────────────────────────────────────────────────
    editorArea.appendChild(textarea);
    editorArea.appendChild(previewContainer);
    this.root.appendChild(editorArea);
  }

  getValue(): string {
    return this.textarea.value;
  }

  setValue(value: string): void {
    this.textarea.value = value;
    this.viewer.render(value);
    this.options.onChange?.(value);
  }

  destroy(): void {
    this.cleanupShortcuts();
    this.viewer.destroy();
    this.root.innerHTML = "";
    this.root.classList.remove("md-editor");
  }
}

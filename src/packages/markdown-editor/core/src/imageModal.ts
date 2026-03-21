type InsertImageFn = (markdown: string) => void;

interface ImageModalOptions {
  uploadImage?: (file: File) => Promise<string>;
  onInsert: InsertImageFn;
}

export function openImageModal(options: ImageModalOptions): void {
  const { uploadImage, onInsert } = options;

  // ─── 오버레이 ────────────────────────────────────────────────────────────────
  const overlay = document.createElement("div");
  overlay.className =
    "md-modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50";

  const modal = document.createElement("div");
  modal.className =
    "md-modal bg-white rounded-lg shadow-xl w-full max-w-md p-6 flex flex-col gap-4";

  // ─── 탭 ─────────────────────────────────────────────────────────────────────
  const tabBar = document.createElement("div");
  tabBar.className = "flex border-b";

  const tabUrl = createTab("URL 입력", true);
  const tabFile = createTab("업로드", false, !uploadImage);
  tabBar.appendChild(tabUrl);
  tabBar.appendChild(tabFile);

  // ─── URL 패널 ────────────────────────────────────────────────────────────────
  const urlPanel = document.createElement("div");
  urlPanel.className = "flex flex-col gap-3";

  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.placeholder = "https://example.com/image.png";
  urlInput.className =
    "border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  const altUrlInput = document.createElement("input");
  altUrlInput.type = "text";
  altUrlInput.placeholder = "대체 텍스트 (선택)";
  altUrlInput.className =
    "border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  urlPanel.appendChild(labelWrap("이미지 URL", urlInput));
  urlPanel.appendChild(labelWrap("대체 텍스트", altUrlInput));

  // ─── 파일 패널 ───────────────────────────────────────────────────────────────
  const filePanel = document.createElement("div");
  filePanel.className = "flex flex-col gap-3 hidden";

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.className = "text-sm";

  const altFileInput = document.createElement("input");
  altFileInput.type = "text";
  altFileInput.placeholder = "대체 텍스트 (선택)";
  altFileInput.className =
    "border rounded px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500";

  const uploadStatus = document.createElement("p");
  uploadStatus.className = "text-sm text-gray-500 hidden";
  uploadStatus.textContent = "업로드 중...";

  filePanel.appendChild(labelWrap("이미지 파일", fileInput));
  filePanel.appendChild(labelWrap("대체 텍스트", altFileInput));
  filePanel.appendChild(uploadStatus);

  // ─── 탭 전환 ─────────────────────────────────────────────────────────────────
  let activeTab: "url" | "file" = "url";

  function activateTab(tab: "url" | "file"): void {
    activeTab = tab;
    if (tab === "url") {
      urlPanel.classList.remove("hidden");
      filePanel.classList.add("hidden");
      tabUrl.classList.add("border-b-2", "border-blue-500", "text-blue-600");
      tabUrl.classList.remove("text-gray-500");
      tabFile.classList.remove(
        "border-b-2",
        "border-blue-500",
        "text-blue-600",
      );
      tabFile.classList.add("text-gray-500");
    } else {
      filePanel.classList.remove("hidden");
      urlPanel.classList.add("hidden");
      tabFile.classList.add("border-b-2", "border-blue-500", "text-blue-600");
      tabFile.classList.remove("text-gray-500");
      tabUrl.classList.remove("border-b-2", "border-blue-500", "text-blue-600");
      tabUrl.classList.add("text-gray-500");
    }
  }

  tabUrl.addEventListener("click", () => activateTab("url"));
  if (uploadImage) {
    tabFile.addEventListener("click", () => activateTab("file"));
  }

  activateTab("url");

  // ─── 버튼 영역 ───────────────────────────────────────────────────────────────
  const actions = document.createElement("div");
  actions.className = "flex justify-end gap-2 mt-2";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.textContent = "취소";
  cancelBtn.className =
    "px-4 py-2 text-sm rounded border hover:bg-gray-50 cursor-pointer";

  const insertBtn = document.createElement("button");
  insertBtn.type = "button";
  insertBtn.textContent = "삽입";
  insertBtn.className =
    "px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer";

  actions.appendChild(cancelBtn);
  actions.appendChild(insertBtn);

  // ─── 닫기 ────────────────────────────────────────────────────────────────────
  function close(): void {
    document.body.removeChild(overlay);
  }

  cancelBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  // ─── 삽입 ────────────────────────────────────────────────────────────────────
  insertBtn.addEventListener("click", async () => {
    if (activeTab === "url") {
      const url = urlInput.value.trim();
      if (!url) return;
      const alt = altUrlInput.value.trim() || "image";
      onInsert(`![${alt}](${url})`);
      close();
    } else if (activeTab === "file" && uploadImage) {
      const file = fileInput.files?.[0];
      if (!file) return;
      try {
        insertBtn.disabled = true;
        uploadStatus.classList.remove("hidden");
        const url = await uploadImage(file);
        const alt = altFileInput.value.trim() || file.name;
        onInsert(`![${alt}](${url})`);
        close();
      } catch {
        uploadStatus.textContent = "업로드 실패. 다시 시도해주세요.";
        insertBtn.disabled = false;
      }
    }
  });

  // ─── 조립 ────────────────────────────────────────────────────────────────────
  modal.appendChild(tabBar);
  modal.appendChild(urlPanel);
  modal.appendChild(filePanel);
  modal.appendChild(actions);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  urlInput.focus();
}

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function createTab(
  label: string,
  active: boolean,
  disabled = false,
): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = [
    "px-4 py-2 text-sm font-medium -mb-px",
    active ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500",
    disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
  ].join(" ");
  if (disabled) btn.disabled = true;
  return btn;
}

function labelWrap(text: string, input: HTMLElement): HTMLElement {
  const wrap = document.createElement("label");
  wrap.className = "flex flex-col gap-1";
  const span = document.createElement("span");
  span.className = "text-sm font-medium text-gray-700";
  span.textContent = text;
  wrap.appendChild(span);
  wrap.appendChild(input);
  return wrap;
}

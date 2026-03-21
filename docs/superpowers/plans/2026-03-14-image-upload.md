# Image Upload via Supabase Storage — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Supabase Storage에 이미지를 업로드하고 마크다운 에디터에서 삽입할 수 있도록 한다.

**Architecture:** 클라이언트 브라우저에서 Supabase JS SDK로 직접 public 버킷에 업로드한다. `src/lib/storage/uploadImage.ts`에 공통 업로드 함수와 용도별 래퍼를 두고, `WikiEditor`에 `uploadImage` prop을 추가해 에디터와 연결한다.

**Tech Stack:** Supabase JS SDK v2 (`@supabase/supabase-js`), Next.js 15, TypeScript

---

## File Map

| 작업 | 파일 |
|------|------|
| 생성 | `src/lib/storage/uploadImage.ts` |
| 수정 | `src/features/wiki-editor/index.tsx` |

---

## Chunk 1: 업로드 함수 구현

### Task 1: `uploadToStorage` 구현

**Files:**
- Create: `src/lib/storage/uploadImage.ts`

- [ ] **Step 1: 파일 생성 — 타입 및 상수 정의**

```typescript
// src/lib/storage/uploadImage.ts

import { createClient } from "@/lib/supabase/client";

const BUCKET = "wiki";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

type Folder = "documents" | "avatars";
```

- [ ] **Step 2: `uploadToStorage` 함수 작성**

```typescript
export async function uploadToStorage(
  file: File,
  folder: Folder,
): Promise<string> {
  // 파일 형식 검증
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`허용되지 않는 파일 형식입니다. (${file.type})`);
  }

  // 파일 크기 검증
  if (file.size > MAX_SIZE) {
    throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
  }

  const supabase = createClient();

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  // 파일명 생성: {folder}/{userId}/{timestamp}-{randomId}.{ext}
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${folder}/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { upsert: false });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}
```

- [ ] **Step 3: 용도별 래퍼 함수 추가**

```typescript
export function uploadDocumentImage(file: File): Promise<string> {
  return uploadToStorage(file, "documents");
}

export function uploadAvatar(file: File): Promise<string> {
  return uploadToStorage(file, "avatars");
}
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/lib/storage/uploadImage.ts
git commit -m "feat: add Supabase storage upload utility"
```

---

## Chunk 2: WikiEditor 연결

### Task 2: `WikiEditor`에 `uploadImage` prop 추가

**Files:**
- Modify: `src/features/wiki-editor/index.tsx`

- [ ] **Step 1: prop 추가 및 에디터에 전달**

`src/features/wiki-editor/index.tsx`를 다음과 같이 수정:

```typescript
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
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/wiki-editor/index.tsx
git commit -m "feat: connect uploadDocumentImage to WikiEditor"
```

---

## Chunk 3: Supabase 대시보드 설정 (수동)

아래 항목은 Supabase 대시보드에서 직접 설정해야 한다.

- [ ] **Step 1: 버킷 생성**
  - Storage → New bucket
  - Name: `wiki`
  - Public: ✅ ON

- [ ] **Step 2: 버킷 제한 설정**
  - `wiki` 버킷 → Edit
  - File size limit: `5242880` (5MB)
  - Allowed MIME types: `image/jpeg, image/png, image/gif, image/webp`

- [ ] **Step 3: RLS 정책 설정**
  - Storage → Policies → `wiki` 버킷

  **SELECT (public read):**
  ```sql
  true
  ```

  **INSERT (로그인 사용자만):**
  ```sql
  auth.uid() IS NOT NULL
  ```

  **DELETE (본인 파일만):**
  ```sql
  auth.uid()::text = (storage.foldername(name))[2]
  ```

  **UPDATE:** 정책 없음 (불허)

---

## 수동 테스트 시나리오

- [ ] 로그인 후 문서 편집 페이지에서 툴바 이미지 버튼 클릭
- [ ] "업로드" 탭이 활성화되는지 확인
- [ ] 이미지 파일 선택 후 삽입 클릭 → 마크다운에 `![...](https://...)` 삽입 확인
- [ ] 뷰어에서 이미지가 실제로 렌더링되는지 확인
- [ ] 5MB 초과 파일 업로드 시 "업로드 실패" 메시지 확인
- [ ] `.svg` 파일 업로드 시 "업로드 실패" 메시지 확인
- [ ] 미로그인 상태에서 업로드 시 "업로드 실패" 메시지 확인

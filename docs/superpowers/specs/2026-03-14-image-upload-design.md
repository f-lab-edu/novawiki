# Image Upload via Supabase Storage — Design Spec

**Date:** 2026-03-14
**Status:** Approved

---

## Overview

Supabase Storage를 이용해 이미지를 업로드하는 기능을 구현한다.
마크다운 에디터 내 이미지 삽입과 프로필/커버 이미지 등 범용적으로 사용할 수 있도록 설계한다.

---

## Storage 구조

- **버킷:** `wiki` (public)
- **폴더 구조:**
  ```
  wiki/
  ├── documents/   # 문서 내 이미지
  └── avatars/     # 프로필 이미지
  ```
- **파일명 규칙:** `{folder}/{userId}/{timestamp}-{randomId}.{ext}`
  - `userId`는 `uploadToStorage` 내부에서 `supabase.auth.getUser()`로 조회
  - 충돌 방지 및 사용자별 파일 추적 목적

---

## 업로드 방식

클라이언트에서 Supabase JS SDK로 직접 업로드 (Client-side direct upload).

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 이미 클라이언트에 노출된 값
- RLS 정책으로 권한 제어

---

## 파일 구조

```
src/lib/storage/
└── uploadImage.ts
```

### API

```typescript
// 공통 업로드 함수 — full public URL 반환
uploadToStorage(file: File, folder: "documents" | "avatars"): Promise<string>

// 용도별 래퍼
uploadDocumentImage(file: File): Promise<string>
uploadAvatar(file: File): Promise<string>
```

반환값은 Supabase public URL 전체:
```
{SUPABASE_URL}/storage/v1/object/public/wiki/{folder}/{userId}/{filename}
```
`imageModal.ts`가 반환값을 `![alt](url)` 형식으로 마크다운에 직접 삽입하므로 path가 아닌 full URL이어야 한다.

### 에디터 연결

`WikiEditor` (`src/features/wiki-editor/index.tsx`)에 `uploadImage` prop을 추가하고,
내부 `<MarkdownEditor>`로 전달한다.

```tsx
// wiki-editor/index.tsx 변경 필요
<MarkdownEditor
  uploadImage={uploadDocumentImage}
  ...
/>
```

---

## 제약 조건

| 항목 | 값 |
|------|-----|
| 허용 형식 | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| 최대 크기 | 5MB |
| SVG 명시적 제외 | XSS 벡터(embedded script) 위험으로 허용하지 않음 |
| 인증 | 로그인한 사용자만 업로드 가능 |

클라이언트 검증 외에, Supabase 대시보드 버킷 설정에서도 동일하게 적용해야 한다:
- `fileSizeLimit`: 5MB
- `allowedMimeTypes`: `image/jpeg, image/png, image/gif, image/webp`

---

## 에러 처리

| 상황 | 처리 |
|------|------|
| 미로그인 | 에러 throw → 이미지 모달에서 "업로드 실패" 표시 |
| 파일 형식 불일치 | 업로드 전 클라이언트 검증 후 에러 throw |
| 파일 크기 초과 | 업로드 전 클라이언트 검증 후 에러 throw |
| Supabase 업로드 실패 | 에러 그대로 throw |

에러 로깅: 프로젝트 스타일 규칙상 `console.log` 미사용. 에러는 throw만 하고 UI에서 generic 메시지 표시.

---

## Supabase RLS 정책

Supabase 대시보드에서 수동 설정 필요:

| 작업 | 정책 |
|------|------|
| SELECT | 모두 허용 (public read) |
| INSERT | `auth.uid() IS NOT NULL` (로그인한 사용자만) |
| DELETE | `auth.uid()::text = (storage.foldername(name))[2]` (본인 파일만) |
| UPDATE | 불허 (파일 교체 시 새 파일 업로드 후 기존 삭제) |

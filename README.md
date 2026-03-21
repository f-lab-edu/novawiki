# NOVAWIKI

[바로가기](https://novawiki.vercel.app/)

Next.js 기반의 위키 플랫폼입니다.

문서 작성·편집, 버전 관리, 문서 비교 등 위키 특유의 기능을 구현하고, 직접 만든 마크다운 에디터를 적용했습니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js, React |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui
| State | TanStack Query, Zustand |
| Backend | Supabase |
| Linter | Biome |

## 주요 기능

- **문서 관리** — 마크다운 기반 작성·편집, 이미지 업로드 (JPEG, PNG, GIF, WebP)
- **위키 링크** — `[[문서 제목]]` 문법으로 문서 간 연결
- **버전 관리** — 모든 수정 이력 저장, 편집 요약 기록
- **버전 비교** — 두 버전 간 diff 시각적 비교
- **되돌리기** — 역사 페이지에서 특정 버전으로 복구
- **조회수** — 문서별 일자별 조회수 기록
- **검색** — 제목·본문 동시 검색, 한글 자모 분리 검색 지원
- **인증** — 이메일/비밀번호, Google OAuth 로그인

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 인기 문서 및 최근 수정 목록 |
| `/d/[문서명]` | 문서 보기 |
| `/e/[문서명]` | 문서 편집 |
| `/h/[문서명]` | 수정 역사 |
| `/c/[문서명]` | 버전 비교 |
| `/search` | 검색 결과 |

## 프로젝트 구조

```
src/
├── app/           # Next.js App Router (pages, api, actions)
├── entities/      # 도메인 모델 및 쿼리 옵션
├── features/      # 기능별 비즈니스 로직 및 UI
├── components/    # 공용 UI 컴포넌트 (shadcn)
├── packages/      # 내부 패키지 (markdown-parser, markdown-editor)
├── store/         # Zustand 전역 상태
├── lib/           # 유틸리티 및 인프라
└── types/         # 공용 TypeScript 타입
```

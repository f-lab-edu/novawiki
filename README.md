# NOVAWIKI

> 기존 위키의 느리고 단절된 소통 구조를 개선하기 위해 시작된 플랫폼입니다.
> Supabase Realtime 기반의 문서별 실시간 채팅과 자체 개발한 마크다운 에디터를 제공합니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | Next.js, React |
| Language | TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Server State | TanStack Query |
| Client State | Zustand |
| Backend | Supabase (DB, Auth, Realtime, Storage) |
| Linter / Formatter | Biome |

---

## 주요 기능

### 문서 편집 및 조회
- **자체 마크다운 에디터** — `src/packages/markdown-editor`에 직접 구현한 에디터. 토크나이저와 파서를 포함한 `markdown-parser` 패키지와 함께 동작
- **위키 문법 지원** — `[[문서 제목]]` 형식의 내부 링크 자동 연결
- **자동 목차 생성** — 헤딩 기반 번호 매기기 및 사이드 인덱스 렌더링

### 버전 관리
- **수정 이력** — 문서의 모든 버전을 기록하고 이력 페이지에서 확인 가능
- **버전 비교** — 두 버전을 선택해 diff 뷰로 변경 내용 시각화
- **버전 되돌리기** — 특정 버전으로 문서 복구 가능

### 실시간 채팅
- **문서별 채팅방** — Supabase Realtime Broadcast를 이용해 문서마다 독립적인 채팅 채널 운영
- **실시간 메시지 수신** — WebSocket 기반으로 새 메시지 즉시 반영

### 검색
- **한국어 자모 분해 검색** — `decomposeKorean` 유틸로 초성 검색 지원
- **실시간 검색 결과** — `/search` 페이지에서 결과 즉시 표시

### 조회수 측정
- **쿠키 기반 중복 방지** — `httpOnly` 쿠키로 12시간 단위 중복 조회 차단
- **Server Action에서 검증** — 클라이언트 조작 없이 서버에서 중복 여부 판단 후 Supabase RPC 호출

---

## 페이지 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 인기 문서 및 최근 수정 목록 |
| `/d/[문서명]` | 문서 조회 (버전 조회: `?v=숫자`) |
| `/e/[문서명]` | 문서 편집 |
| `/h/[문서명]` | 수정 이력 |
| `/c/[문서명]` | 버전 비교 (`?prev=N&next=M`) |
| `/search` | 검색 결과 |

---

## 아키텍처

```
src/
├── entities/          # 도메인 모델 + TanStack Query 옵션 정의 (queryOptions / mutationOptions)
├── features/          # 기능별 UI + 비즈니스 로직
│   ├── document/      # 문서 조회, 채팅 포함
│   ├── edit/          # 문서 편집 폼
│   ├── history/       # 수정 이력 테이블
│   ├── compare/       # 버전 diff 뷰
│   ├── search/        # 검색 결과
│   └── ...
├── components/        # 재사용 가능한 순수 UI (shadcn/ui 래퍼)
├── lib/               # 인프라: Supabase 클라이언트, 유틸, 플러그인
├── store/             # Zustand 전역 상태 (useUserStore — 인증)
├── app/
│   ├── (pages)/       # Next.js App Router 페이지
│   ├── api/           # API Route Handlers
│   └── actions/       # Server Actions (document, user, auth)
└── packages/
    ├── markdown-parser/   # 커스텀 마크다운 파서 (토크나이저 포함)
    └── markdown-editor/   # 커스텀 에디터 (core + React 래퍼)
```

### 레이어 의존성 규칙

```
pages → features → entities → lib/components
```

- **entities** — `components`, `lib`만 import 가능. 비즈니스 로직 없음
- **features** — `entities`, `components`, `lib`만 import 가능
- **pages** — 모든 레이어 사용 가능

### 데이터 흐름

- **서버 상태** — TanStack Query. `entities` 레이어에서 `queryOptions` / `mutationOptions` 정의, `features`에서 소비
- **인증 상태** — Zustand (`useUserStore`). `src/authProvider.tsx`가 Supabase auth 변경을 구독하고 동기화
- **SSR** — 페이지에서 `prefetchQuery` + `HydrationBoundary`로 서버에서 데이터 주입

---

## 커스텀 패키지

### `@f-wiki/markdown-parser`

> `src/packages/markdown-parser`

마크다운 문자열을 HTML로 변환하는 자체 파서.

- **tokenizer** — 원시 문자열을 토큰 스트림으로 분리
- **inline parser** — 강조, 링크, 코드, 위키 링크 등 인라인 요소 처리
- **block parser** — 헤딩, 리스트, 코드 블록, 테이블 등 블록 요소 처리

### `@f-wiki/markdown-editor`

> `src/packages/markdown-editor`

`markdown-parser`를 기반으로 동작하는 자체 에디터.

- **core** — 프레임워크 독립적인 에디터 핵심 로직
- **react** — React 컴포넌트 래퍼 (`@f-wiki/markdown-editor-react`)


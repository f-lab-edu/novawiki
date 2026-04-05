# NOVAWIKI

<div align="center">
<img width="600" height="200" alt="Frame 16-(Compressify io)" src="https://github.com/user-attachments/assets/868bf6e4-b4b5-4865-bba8-e3b49bd7d1df" />

<br /><br />

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=zustand&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)

</div>

## 시작하게 된 이유
‘노바위키’는 기존 위키의 느리고 단절된 소통 구조를 개선하기 위해 시작된 플랫폼입니다.

위키를 소비하는 대부분의 사용자 중 직접 편집에 참여하는 경우는 극소수입니다.
이는 편집 에디터에서 별도의 문법을 익혀야 하는 진입 장벽 때문입니다.

노바위키는 보다 직관적이고 대중적인 마크다운 에디터를 도입했습니다.
사용자는 별도의 학습 없이도 쉽게 문서를 작성하고 수정할 수 있습니다.

또한 기존 위키의 토론 방식은 형식적이고 딱딱한 구조를 가지고 있었습니다.
이를 개선하기 위해 채팅 UI를 도입하여, 사용자들이 보다 자연스럽고 편하게 의견을 나눌 수 있도록 했습니다.

## 주요 기능

### 문서 편집 및 조회
- **자체 마크다운 에디터** : `src/packages/markdown-editor`에 직접 구현한 마크다운 에디터 제공 ([편집페이지](https://novawiki.vercel.app/e/%EB%85%B8%EB%B0%94%EC%9C%84%ED%82%A4) 에서 기능 제공)
- **위키 문법 지원** : `[[문서 제목]]` 형식의 내부 링크 자동 연결
- **자동 목차 생성** : Heading(h1, h2) 기반 번호 매기기 및 사이드 인덱스 렌더링

### 버전 관리
- **수정 이력** : 문서의 모든 버전을 기록하고 [역사 페이지](https://novawiki.vercel.app/h/%EB%85%B8%EB%B0%94%EC%9C%84%ED%82%A4)에서 확인 가능
- **버전 비교** : [비교페이지](https://novawiki.vercel.app/c/%EB%85%B8%EB%B0%94%EC%9C%84%ED%82%A4?prev=19&next=1) 두 버전을 선택해 diff 뷰로 변경 내용 시각화
- **버전 되돌리기** : [역사 페이지](https://novawiki.vercel.app/h/%EB%85%B8%EB%B0%94%EC%9C%84%ED%82%A4)에서 특정 버전으로 문서 복구 가능

### 실시간 채팅
- **문서별 채팅방** : Supabase Realtime Broadcast를 이용해 문서마다 독립적인 채팅 채널 운영 ([문서페이지](https://novawiki.vercel.app/d/%EB%85%B8%EB%B0%94%EC%9C%84%ED%82%A4) 에서 기능 제공)

### 검색
- **한국어 자모 분리 검색** : 부분 입력만으로도 자연스럽게 검색하도록 제공 (톳 -> 토스 검색)


## 아키텍처

```
src/
├── entities/          # TanStack Query 옵션 정의
├── features/          # 기능별 UI + 비즈니스 로직
│   ├── document/      # 문서 조회, 채팅 포함
│   ├── edit/          # 문서 편집 폼
│   ├── history/       # 수정 이력 테이블
│   ├── compare/       # 버전 diff 뷰
│   └── search/        # 검색 결과
├── components/        # 재사용 가능한 UI (shadcn/ui 래퍼)
├── lib/               # Supabase 클라이언트, 유틸, 플러그인
├── store/             # Zustand 전역 상태
├── app/
│   ├── (pages)/       # Next.js App Router 페이지
│   ├── api/           # API Route Handlers
│   └── actions/       # Server Actions
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


- **react** — React 컴포넌트 래퍼 (`@f-wiki/markdown-editor-react`)


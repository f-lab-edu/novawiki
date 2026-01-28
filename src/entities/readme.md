# Entities

## 역할

비즈니스 도메인의 핵심 개념(엔티티)을 정의하는 레이어입니다.
**"무엇을 다루는가"** 에 초점을 맞춥니다.

- 도메인 모델의 타입/인터페이스 정의
- 엔티티를 표현하는 순수 UI 컴포넌트
- 비즈니스 로직이 없는 단순 표현 담당

## 의존성 규칙

- `shared` 레이어만 import 가능
- `features`, `widgets` 은 import 불가

## 폴더 구조

```
entities/
├── document/
│   ├── model/
│   │   └── types.ts          # 타입 정의
│   ├── ui/
│   │   └── DocumentCard.tsx  # 엔티티 표현 UI
│   └── index.ts              # public API
│
├── user/
│   ├── model/
│   │   └── types.ts
│   ├── ui/
│   │   └── UserAvatar.tsx
│   └── index.ts
```

## 예시

### 타입 정의

```ts
// entities/document/model/types.ts
export interface Document {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}
```

### UI 컴포넌트

```tsx
// entities/document/ui/DocumentCard.tsx
import { Document } from '../model/types';

interface Props {
  document: Document;
}

export function DocumentCard({ document }: Props) {
  return (
    <article className="p-4 border rounded-lg">
      <h3 className="font-semibold">{document.title}</h3>
      <time className="text-sm text-gray-500">{document.updatedAt}</time>
    </article>
  );
}
```

### Public API

```ts
// entities/document/index.ts
export type { Document } from './model/types';
export { DocumentCard } from './ui/DocumentCard';
```

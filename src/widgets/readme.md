# Widgets

## 역할

독립적인 UI 블록을 담당하는 레이어입니다.
**"어떻게 조합하는가"** 에 초점을 맞춥니다.

- entities와 features를 조합하여 완성된 UI 블록 구성
- 페이지에 배치할 수 있는 독립적인 컴포넌트
- 레이아웃 구성 요소 (Header, Sidebar, Footer 등)

## 의존성 규칙

- `shared`, `entities`, `features` 레이어 import 가능
- 다른 `widgets`는 import 불가 (순환 의존 방지)

## 폴더 구조

```
widgets/
├── header/
│   ├── ui/
│   │   └── Header.tsx
│   └── index.ts
│
├── sidebar/
│   ├── ui/
│   │   └── Sidebar.tsx
│   └── index.ts
│
├── document-list/
│   ├── ui/
│   │   └── DocumentList.tsx
│   └── index.ts
│
├── document-detail/
│   ├── ui/
│   │   └── DocumentDetail.tsx
│   └── index.ts
```

## 예시

### Header 위젯

```tsx
// widgets/header/ui/Header.tsx
'use client'

import { useUserStore } from '@/shared/lib/store/useUserStore';
import { Button } from '@/shared/ui';
import { LoginButton } from '@/features/auth';

export function Header() {
  const user = useUserStore((state) => state.user);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-xl font-bold">F-Wiki</h1>
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <span>{user.email}</span>
            <Button variant="secondary">로그아웃</Button>
          </>
        ) : (
          <LoginButton />
        )}
      </nav>
    </header>
  );
}
```

### DocumentList 위젯

```tsx
// widgets/document-list/ui/DocumentList.tsx
'use client'

import { DocumentCard } from '@/entities/document';
import { useDocuments } from '@/features/document';
import { DeleteButton } from '@/features/delete-document';

export function DocumentList() {
  const { data: documents, isLoading } = useDocuments();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">최근 문서</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents?.map((doc) => (
          <div key={doc.id} className="relative">
            <DocumentCard document={doc} />
            <DeleteButton documentId={doc.id} />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Sidebar 위젯

```tsx
// widgets/sidebar/ui/Sidebar.tsx
'use client'

import Link from 'next/link';
import { useDocuments } from '@/features/document';

export function Sidebar() {
  const { data: documents } = useDocuments();

  return (
    <aside className="w-64 p-4 border-r h-screen">
      <h2 className="font-semibold mb-4">문서 목록</h2>
      <ul className="space-y-2">
        {documents?.slice(0, 10).map((doc) => (
          <li key={doc.id}>
            <Link
              href={`/wiki/${doc.id}`}
              className="text-blue-600 hover:underline"
            >
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

### Public API

```ts
// widgets/header/index.ts
export { Header } from './ui/Header';

// widgets/document-list/index.ts
export { DocumentList } from './ui/DocumentList';

// widgets/sidebar/index.ts
export { Sidebar } from './ui/Sidebar';
```

## 페이지에서 사용 예시

```tsx
// app/(pages)/page.tsx
import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import { DocumentList } from '@/widgets/document-list';

export default function HomePage() {
  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <DocumentList />
        </main>
      </div>
    </div>
  );
}
```

## 레이어 의존성 흐름

```
app (pages)
    ↓ 사용
widgets ← 여기 (entities + features 조합)
    ↓ 사용
features
    ↓ 사용
entities
    ↓ 사용
shared
```

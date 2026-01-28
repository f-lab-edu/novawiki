# Features

## 역할

사용자 행동과 비즈니스 로직을 담당하는 레이어입니다.
**"어떤 행동을 하는가"** 에 초점을 맞춥니다.

- API 호출 함수
- TanStack Query 훅 (useQuery, useMutation)
- 상태 변경 로직
- 행동을 트리거하는 UI (폼, 버튼 등)

## 의존성 규칙

- `shared`, `entities` 레이어만 import 가능
- `widgets` 은 import 불가

## 폴더 구조

```
features/
├── document/
│   ├── api/
│   │   └── documentApi.ts      # Supabase CRUD 함수
│   ├── hooks/
│   │   └── useDocument.ts      # TanStack Query 훅
│   ├── ui/
│   │   └── CreateDocumentForm.tsx
│   └── index.ts
│
├── auth/
│   ├── api/
│   │   └── authApi.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── ui/
│   │   └── LoginForm.tsx
│   └── index.ts
```

## 예시

### API 함수

```ts
// features/document/api/documentApi.ts
import { supabase } from '@/shared/lib/supabase/client';
import { Document } from '@/entities/document';

export const getDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createDocument = async (doc: { title: string; content: string }) => {
  const { data, error } = await supabase
    .from('documents')
    .insert(doc)
    .select()
    .single();

  if (error) throw error;
  return data;
};
```

### TanStack Query 훅

```ts
// features/document/hooks/useDocument.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocuments, createDocument } from '../api/documentApi';

export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
};
```

### UI 컴포넌트

```tsx
// features/document/ui/CreateDocumentForm.tsx
'use client'

import { useState } from 'react';
import { useCreateDocument } from '../hooks/useDocument';

export function CreateDocumentForm() {
  const [title, setTitle] = useState('');
  const mutation = useCreateDocument();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, content: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="문서 제목"
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? '생성 중...' : '생성'}
      </button>
    </form>
  );
}
```

### Public API

```ts
// features/document/index.ts
export { getDocuments, createDocument } from './api/documentApi';
export { useDocuments, useCreateDocument } from './hooks/useDocument';
export { CreateDocumentForm } from './ui/CreateDocumentForm';
```

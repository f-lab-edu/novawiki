# Shared

## 역할

프로젝트 전체에서 공유되는 재사용 가능한 코드를 담당하는 레이어입니다.

**비즈니스 로직과 무관한 범용 코드**를 포함합니다.

- 공용 UI 컴포넌트 (Button, Input, Modal 등)
- 유틸리티 함수
- 외부 라이브러리 설정 (Supabase, Zustand 등)
- 상수, 타입, 설정 값

## 의존성 규칙

- 다른 레이어를 import 불가 (최하위 레이어)
- 오직 외부 라이브러리만 import 가능

## 폴더 구조

```
shared/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── index.ts
│
├── lib/
│   ├── supabase/
│   │   └── client.ts         # Supabase 클라이언트
│   ├── store/
│   │   └── useUserStore.ts   # Zustand 스토어
│   └── utils/
│       └── formatDate.ts
│
├── config/
│   └── constants.ts
│
├── types/
│   └── common.ts
```

## 예시

### UI 컴포넌트

```tsx
// shared/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export function Button({
  variant = 'primary',
  isLoading,
  children,
  ...props
}: ButtonProps) {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg ${styles[variant]} disabled:opacity-50`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? '로딩...' : children}
    </button>
  );
}
```

### Supabase 클라이언트

```ts
// shared/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Zustand 스토어

```ts
// shared/lib/store/useUserStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### 유틸리티 함수

```ts
// shared/lib/utils/formatDate.ts
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

### Public API

```ts
// shared/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
```

## 레이어 의존성 흐름

```
app (pages)
    ↓
widgets
    ↓
features
    ↓
entities
    ↓
shared ← 최하위 (다른 레이어 import 불가)
```

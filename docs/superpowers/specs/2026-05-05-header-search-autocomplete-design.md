# 헤더 검색창 자동완성 — Design Spec

**작성일:** 2026-05-05
**대상:** `src/features/nav/Header.tsx` 데스크탑 검색창

## 1. 목적

헤더의 데스크탑 검색 input에 자동완성 드롭다운을 추가한다. 사용자가 타이핑하면 디바운스된 요청으로 문서명 매칭 상위 5개를 보여주고, 키보드(↑/↓/Enter/ESC)와 마우스로 선택해 해당 문서로 즉시 이동할 수 있게 한다.

기존 동작(빈 선택 상태에서 Enter → `/search?q=...`)은 그대로 보존한다.

## 2. 범위

**포함:**
- 데스크탑 헤더 검색창의 자동완성
- 문서명(title) 기반 검색만 (한글 자모 분해 매칭 활용)
- 최대 5개 결과 표시
- 키보드 네비게이션 (↑/↓/Enter/ESC)
- 마우스 클릭/호버

**제외:**
- 모바일 검색창의 자동완성 (기존 `/search` 이동 동작만 유지)
- 본문(content) 기반 자동완성
- 매칭 부분 하이라이트
- 최근 검색어/추천 검색어

## 3. 컴포넌트 구조

```
src/features/search/ui/SearchAutocomplete.tsx   (신규)
src/lib/hooks/useDebounce.ts                    (신규)
src/features/nav/Header.tsx                     (데스크탑 input 부분만 교체)
```

`SearchAutocomplete`가 다음을 모두 캡슐화한다:
- 입력값 상태 (`searchQuery`)
- 디바운스된 값 (200ms)
- 자동완성 결과 fetching
- 드롭다운 표시/닫힘
- 선택된 항목 인덱스 (`selectedIndex`)
- 키보드/마우스 핸들링
- 라우팅 (`/d/[id]` 또는 `/search?q=...`)

`Header.tsx`는 기존 `searchQuery` state, `handleSearch` 함수, 데스크탑 `InputGroup` 블록을 제거하고 그 자리에 `<SearchAutocomplete />` 한 줄로 대체한다. 모바일 검색창(`mobileSearchOpen` 분기 이하) 및 그 외 헤더 영역은 변경하지 않는다.

## 4. 데이터 페칭

기존 `entities/search`의 `searchQueryOptions(query, "title", 0)`을 그대로 재사용한다.

- 백엔드(`/api/document/search?type=title`)는 이미 `LIMIT=5`로 동작하며 한글 자모 분해 검색을 적용한다.
- 별도의 자동완성 전용 엔드포인트나 query option은 만들지 않는다.

```ts
const debouncedQuery = useDebounce(searchQuery, 200);

const { data } = useQuery({
  ...searchQueryOptions(debouncedQuery, "title", 0),
  enabled: debouncedQuery.trim().length > 0,
  staleTime: 30_000,
});

const items = data?.data?.docs ?? [];
```

**`useDebounce` 훅:**
```ts
// src/lib/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
```

**캐싱:** TanStack Query의 동일 키 캐싱이 자동으로 적용된다. `staleTime: 30_000`으로 같은 단어 재입력 시 즉시 표시.

## 5. 표시 조건

드롭다운은 다음을 **모두** 만족할 때만 표시한다:

1. input이 포커스 상태 (`isFocused`)
2. `debouncedQuery.trim().length > 0`
3. `items.length > 0`

결과 0개일 때 "결과 없음" 박스를 띄우지 않고 드롭다운 자체를 숨긴다.

## 6. 인터랙션

### 상태

- `selectedIndex: number` — `-1`이면 미선택, `0..items.length-1`은 항목 포커스.
- 입력값(`searchQuery`)이 바뀌면 `selectedIndex`를 `-1`로 리셋한다.

### 키보드 (input의 `onKeyDown`)

| 키 | 조건 | 동작 |
|---|---|---|
| `ArrowDown` | 드롭다운 열림 | `selectedIndex = Math.min(selectedIndex + 1, items.length - 1)`. `preventDefault`. |
| `ArrowUp` | `selectedIndex > 0` | `selectedIndex -= 1`. `preventDefault`. |
| `ArrowUp` | `selectedIndex === 0` | `selectedIndex = -1` (input으로 복귀). `preventDefault`. |
| `Enter` | `selectedIndex >= 0` | `router.push(\`/d/${items[selectedIndex].id}\`)` + 드롭다운 닫기. |
| `Enter` | `selectedIndex === -1` AND `searchQuery.trim()` | `router.push(\`/search?q=${encodeURIComponent(searchQuery.trim())}\`)` (기존 동작 유지). |
| `Escape` | 드롭다운 열림 | 드롭다운 닫기, input 포커스 유지, `selectedIndex = -1`. |

### 마우스

- 항목 `onMouseEnter` → 해당 인덱스로 `selectedIndex` 동기화 (호버/키보드 포커스 시각 통일).
- 항목 `onClick` → Enter와 동일하게 `/d/[id]`로 이동.
- input/드롭다운 외부 클릭 → 드롭다운 닫기. 컨테이너 ref + `mousedown` 외부 감지 또는 input의 `onBlur` 사용.

**`onBlur` 함정:** 항목 클릭 시 input의 blur가 먼저 발생해 드롭다운이 사라지면 클릭이 무효가 된다. 항목에 `onMouseDown={(e) => e.preventDefault()}`로 blur를 막고, `onClick`에서 처리한다.

### 라우팅 후 정리

문서로 이동하든 검색 페이지로 이동하든 다음을 수행한다:
- 드롭다운 닫기 (`isFocused`/`isOpen` 적절히 리셋)
- `selectedIndex = -1`
- input 값은 비우지 않는다(이전 헤더 동작과 일치)

## 7. UI / 스타일

shadcn 톤과 일치시키되 별도 라이브러리(`Command`, `Popover`)는 사용하지 않는다.

**레이아웃:**
- `SearchAutocomplete` 루트: `relative`.
- input은 기존 `InputGroup` + `InputGroupInput` + `InputGroupAddon`(`SearchIcon`) 그대로 사용.
- 드롭다운: `absolute top-full left-0 right-0 mt-1 z-50`로 input 아래 동일 너비 등장.
- 컨테이너 클래스: `bg-popover text-popover-foreground border rounded-md shadow-md overflow-hidden`.

**항목:**
- `<button type="button">` 한 줄 (제목만, `truncate`).
- 클래스: `w-full text-left px-3 py-2 text-sm cursor-pointer`.
- 선택된 항목(`isSelected`): `bg-accent text-accent-foreground`. 호버 시에도 동일 클래스로 시각 통일.

**로딩 상태:** 별도 스피너 없음. 결과가 도착하기 전엔 드롭다운을 띄우지 않는다 (이전 캐시 결과가 있으면 자동으로 그것을 표시).

## 8. 접근성 (ARIA Combobox)

- input:
  - `role="combobox"`
  - `aria-autocomplete="list"`
  - `aria-expanded={isOpen}`
  - `aria-controls="search-autocomplete-listbox"`
  - `aria-activedescendant={selectedIndex >= 0 ? \`search-autocomplete-item-${items[selectedIndex].id}\` : undefined}`
- 드롭다운: `role="listbox" id="search-autocomplete-listbox"`
- 각 항목: `role="option" id={\`search-autocomplete-item-${doc.id}\`} aria-selected={isSelected}`

## 9. 변경 파일

| 파일 | 변경 |
|---|---|
| `src/features/search/ui/SearchAutocomplete.tsx` | 신규 |
| `src/features/search/index.ts` | `SearchAutocomplete` export 추가 |
| `src/lib/hooks/useDebounce.ts` | 신규 |
| `src/features/nav/Header.tsx` | 데스크탑 input 블록을 `<SearchAutocomplete />`로 교체. `searchQuery` state, `handleSearch` 함수 제거(데스크탑 한정). 모바일 분기는 자체 state로 분리하거나 그대로 유지. |

**Header.tsx의 모바일 처리:** 모바일 검색창은 자동완성을 적용하지 않으므로, 기존 `searchQuery` state와 `handleSearch`를 모바일 input 전용으로 헤더에 남긴다(또는 헤더 내부에서 변수명을 `mobileSearchQuery`로 명확히 한다).

## 10. 비기능 요건

- **요청량:** 200ms 디바운스 + TanStack Query 캐싱으로 빠른 타이핑 시에도 요청 수 최소화.
- **성능:** 결과 5건이라 렌더 비용 무시 가능. 드롭다운 닫힌 동안에는 query `enabled: false`로 네트워크 호출도 발생 안 함.
- **번들:** 외부 의존성 추가 없음.

## 11. 테스트 계획

수동 검증 시나리오 (자동 테스트 프레임워크 미설정):

1. 데스크탑에서 한 글자 입력 → 200ms 후 최대 5개 결과 표시.
2. 빠르게 여러 글자 입력 → 마지막 입력 200ms 후 한 번만 결과 갱신.
3. 결과 0개인 단어 입력 → 드롭다운 안 뜸.
4. 입력 비우기 → 드롭다운 닫힘.
5. ↓ 5번 → 마지막 항목까지 이동, 그 이상 ↓는 변화 없음.
6. ↑로 위로 올라가서 첫 항목에서 ↑ 한 번 더 → 선택 해제(input 복귀).
7. 항목 선택 후 Enter → `/d/[id]`로 이동.
8. 선택 없이 Enter → `/search?q=...`로 이동.
9. ESC → 드롭다운 닫힘, input 포커스 유지.
10. 항목 마우스 호버 → 해당 항목 선택 표시.
11. 항목 클릭 → 즉시 문서로 이동(blur 경합으로 인한 동작 누락 없음).
12. 외부 클릭 → 드롭다운 닫힘.
13. 한글 자모(예: "ㄹㅇㅌ" → "리액트") 매칭 동작 확인.
14. 모바일 돋보기 클릭 → 기존 검색창 펼침. 자동완성 드롭다운은 뜨지 않음. Enter 시 `/search?q=...` 이동.

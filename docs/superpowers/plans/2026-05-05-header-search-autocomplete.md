# Header Search Autocomplete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add keyboard- and mouse-navigable autocomplete to the desktop header search input. Typing fires a debounced request that returns up to 5 title matches; ↑/↓ focuses items, Enter navigates to that document, empty selection + Enter falls back to the existing `/search?q=...` behavior.

**Architecture:** Extract the desktop search into a self-contained `SearchAutocomplete` component under `src/features/search/ui/`. It owns the input state, debounced query, dropdown visibility, and keyboard/mouse interactions. Reuses the existing `searchQueryOptions(query, "title", 0)` (LIMIT=5 backend) and a new `useDebounce` hook. Header.tsx is reduced to a one-line consumer for desktop; the mobile input keeps its existing local state and `/search` Enter behavior.

**Tech Stack:** Next.js 16 App Router, React, TanStack Query, Zustand (already in use), Tailwind, shadcn `InputGroup`. No new dependencies.

**Spec:** [docs/superpowers/specs/2026-05-05-header-search-autocomplete-design.md](../specs/2026-05-05-header-search-autocomplete-design.md)

**Note on testing:** This project has no test framework configured (per `CLAUDE.md`). Verification uses `npm run lint`, `npm run build`, and a manual browser checklist at the end (Task 5). No automated tests are written.

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `src/lib/hooks/useDebounce.ts` | Create | Generic debounce hook |
| `src/features/search/ui/SearchAutocomplete.tsx` | Create | Self-contained desktop search w/ autocomplete dropdown |
| `src/features/search/index.ts` | Modify | Export `SearchAutocomplete` |
| `src/features/nav/Header.tsx` | Modify | Replace desktop input block with `<SearchAutocomplete />`. Keep mobile input + its local `searchQuery`/`handleSearch`. |

---

### Task 1: `useDebounce` hook

**Files:**
- Create: `src/lib/hooks/useDebounce.ts`

- [ ] **Step 1: Create the hook file**

Create `src/lib/hooks/useDebounce.ts`:

```typescript
import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint`
Expected: No errors related to the new file. (Pre-existing project warnings, if any, are not introduced by this file.)

- [ ] **Step 3: Commit**

```bash
git add src/lib/hooks/useDebounce.ts
git commit -m "feat: add useDebounce hook"
```

---

### Task 2: `SearchAutocomplete` — skeleton + data fetching + click-to-navigate

This task creates the component with input, debounced query, dropdown rendering, and mouse-click navigation. Keyboard navigation is added in Task 3 to keep diffs reviewable.

**Files:**
- Create: `src/features/search/ui/SearchAutocomplete.tsx`
- Modify: `src/features/search/index.ts`

- [ ] **Step 1: Create the component file**

Create `src/features/search/ui/SearchAutocomplete.tsx`:

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";
import { searchQueryOptions } from "@/entities";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/shadcn/utils";

const LISTBOX_ID = "search-autocomplete-listbox";
const itemId = (id: number) => `search-autocomplete-item-${id}`;

export function SearchAutocomplete() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 200);

  const { data } = useQuery({
    ...searchQueryOptions(debouncedQuery, "title", 0),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 30_000,
  });

  const items = data?.data?.docs ?? [];
  const isOpen =
    isFocused && debouncedQuery.trim().length > 0 && items.length > 0;

  // Outside click → close
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  const goToDoc = (id: number) => {
    setIsFocused(false);
    router.push(`/d/${id}`);
  };

  const goToSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <InputGroup>
        <InputGroupInput
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              goToSearch();
            }
          }}
          aria-controls={LISTBOX_ID}
          aria-expanded={isOpen}
          {...{ role: "combobox", "aria-autocomplete": "list" }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {isOpen && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover text-popover-foreground border rounded-md shadow-md overflow-hidden"
        >
          {items.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                id={itemId(doc.id)}
                role="option"
                aria-selected={false}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToDoc(doc.id)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm cursor-pointer truncate",
                  "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {doc.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Export from feature barrel**

Modify `src/features/search/index.ts`:

```typescript
export { SearchView } from "./SearchView";
export { SearchAutocomplete } from "./ui/SearchAutocomplete";
```

- [ ] **Step 3: Verify lint and types**

Run: `npm run lint`
Expected: No errors related to the new files.

Run: `npm run build`
Expected: Build succeeds. (If Next 16 type-checks during build, this confirms TypeScript is clean.)

- [ ] **Step 4: Commit**

```bash
git add src/features/search/ui/SearchAutocomplete.tsx src/features/search/index.ts
git commit -m "feat: add SearchAutocomplete component with debounced query and click navigation"
```

---

### Task 3: Add keyboard navigation (↑/↓/Enter/ESC) and ARIA active descendant

**Files:**
- Modify: `src/features/search/ui/SearchAutocomplete.tsx`

- [ ] **Step 1: Replace `SearchAutocomplete.tsx` with full keyboard support**

This step replaces the entire file with the version that includes keyboard handling. The full file is shown rather than a diff so the engineer doesn't need to reconstruct it from fragments.

Replace `src/features/search/ui/SearchAutocomplete.tsx` with:

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";
import { searchQueryOptions } from "@/entities";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/shadcn/utils";

const LISTBOX_ID = "search-autocomplete-listbox";
const itemId = (id: number) => `search-autocomplete-item-${id}`;

export function SearchAutocomplete() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(searchQuery, 200);

  const { data } = useQuery({
    ...searchQueryOptions(debouncedQuery, "title", 0),
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 30_000,
  });

  const items = data?.data?.docs ?? [];
  const isOpen =
    isFocused && debouncedQuery.trim().length > 0 && items.length > 0;

  // Reset selection whenever the query changes.
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Clamp selectedIndex when items shrink.
  useEffect(() => {
    if (selectedIndex >= items.length) {
      setSelectedIndex(items.length === 0 ? -1 : items.length - 1);
    }
  }, [items.length, selectedIndex]);

  // Outside click → close.
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  const closeDropdown = () => {
    setIsFocused(false);
    setSelectedIndex(-1);
  };

  const goToDoc = (id: number) => {
    closeDropdown();
    router.push(`/d/${id}`);
  };

  const goToSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    closeDropdown();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, items.length - 1));
      return;
    }

    if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      setSelectedIndex((i) => (i <= 0 ? -1 : i - 1));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (isOpen && selectedIndex >= 0 && selectedIndex < items.length) {
        goToDoc(items[selectedIndex].id);
      } else {
        goToSearch();
      }
      return;
    }

    if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      setSelectedIndex(-1);
      setIsFocused(false);
      return;
    }
  };

  const activeDescendant =
    isOpen && selectedIndex >= 0 ? itemId(items[selectedIndex].id) : undefined;

  return (
    <div ref={containerRef} className="relative">
      <InputGroup>
        <InputGroupInput
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          aria-controls={LISTBOX_ID}
          aria-expanded={isOpen}
          aria-activedescendant={activeDescendant}
          {...{ role: "combobox", "aria-autocomplete": "list" }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {isOpen && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover text-popover-foreground border rounded-md shadow-md overflow-hidden"
        >
          {items.map((doc, index) => {
            const isSelected = index === selectedIndex;
            return (
              <li key={doc.id}>
                <button
                  type="button"
                  id={itemId(doc.id)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => goToDoc(doc.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm cursor-pointer truncate",
                    isSelected
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  {doc.title}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint`
Expected: No errors related to the modified file.

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/features/search/ui/SearchAutocomplete.tsx
git commit -m "feat: add keyboard navigation to SearchAutocomplete"
```

---

### Task 4: Wire `SearchAutocomplete` into `Header.tsx`

The desktop input block is replaced with a single `<SearchAutocomplete />`. The mobile input keeps its own state — we rename the existing `searchQuery`/`handleSearch` to `mobileSearchQuery`/`handleMobileSearch` so it's clear they're mobile-only.

**Files:**
- Modify: `src/features/nav/Header.tsx`

- [ ] **Step 1: Replace `Header.tsx` with the wired-up version**

Replace `src/features/nav/Header.tsx` with:

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { SearchIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";
import { profileQueryOptions } from "@/entities";
import { SearchAutocomplete } from "@/features/search";
import { useUserStore } from "@/store/useUserStore";

export function Header() {
  const router = useRouter();
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { isAuthenticated, isLoading, clearUser } = useUserStore();
  const { data } = useQuery({
    ...profileQueryOptions(),
    enabled: isAuthenticated,
  });
  const avatarUrl = data?.data?.avatar_url ?? null;

  const handleLogout = async () => {
    await logout();
    clearUser();
  };

  const handleMobileSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
    }
  };

  return (
    <header className="border-b">
      <div className="flex justify-center">
        <div className="flex justify-between w-full sm:w-300 h-15 px-4 sm:px-0">
          <div className="flex items-center">
            <div className="font-extrabold text-xl sm:text-2xl tracking-tighter">
              <Link href="/">NOVAWIKI</Link>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            {/* 데스크탑 검색창 */}
            <div className="hidden sm:flex">
              <SearchAutocomplete />
            </div>
            {/* 모바일 검색 아이콘 */}
            <button
              type="button"
              className="flex sm:hidden cursor-pointer"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="검색"
            >
              <SearchIcon className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
              ) : isAuthenticated ? (
                <div className="flex gap-2 items-center">
                  <Link href="/my" aria-label="마이페이지">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="프로필"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <>
                  <Link href="/login">
                    <Button className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm">
                      회원가입
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 모바일 검색창 */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 py-2 border-t">
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              onKeyDown={handleMobileSearch}
              autoFocus
              className="text-sm"
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint`
Expected: No errors.

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/features/nav/Header.tsx
git commit -m "feat: wire SearchAutocomplete into Header desktop search"
```

---

### Task 5: Manual verification in browser

No automated tests exist; this task is a checklist. Run `npm run dev` and verify each scenario in a desktop-width browser window. For mobile-only items, use DevTools device emulation.

- [ ] **Step 1: Start dev server**

Run: `npm run dev`
Open: `http://localhost:3000` in a browser.

- [ ] **Step 2: Verify desktop autocomplete behavior**

Pre-condition: confirm the database has at least 5 visible documents whose titles contain a common substring (e.g., a Korean word). If not, seed test data first.

Walk through each scenario; check the box once verified:

- [ ] Type a single character → after ~200ms, dropdown shows up to 5 title matches.
- [ ] Type quickly across multiple characters → dropdown updates only once after typing stops (~200ms).
- [ ] Clear the input → dropdown disappears.
- [ ] Type a string that matches no documents → dropdown does NOT appear (no "결과 없음" box).
- [ ] Press ↓ once → first item highlighted (`bg-accent`).
- [ ] Press ↓ until last item, then ↓ again → highlight stays on last item (no wrap).
- [ ] Press ↑ from middle item → previous item highlighted.
- [ ] Press ↑ on first item → highlight clears, focus returns to input (no item highlighted).
- [ ] With an item highlighted, press Enter → navigates to `/d/<id>` of that item.
- [ ] With no item highlighted (input has text), press Enter → navigates to `/search?q=<text>`.
- [ ] With empty input, press Enter → nothing happens (no navigation).
- [ ] Press ESC while dropdown is open → dropdown closes, input keeps focus, input value preserved.
- [ ] Hover an item with mouse → highlight follows the mouse.
- [ ] Click an item → navigates to `/d/<id>` immediately (no flicker / lost click from blur).
- [ ] Click outside the search area → dropdown closes.
- [ ] Re-focus the input (with the same query still typed) → dropdown reopens with cached results immediately.
- [ ] Type a Korean jamo string (e.g. `ㄹㅇㅌ`) that decomposes to a known title (e.g., 리액트) → matching documents appear.

- [ ] **Step 3: Verify mobile search is unchanged**

Switch DevTools to a phone viewport (width < 640px / `sm` breakpoint).

- [ ] Tap the magnifier icon → mobile search bar appears, input auto-focuses.
- [ ] Type any text → no autocomplete dropdown appears.
- [ ] Press Enter with text → navigates to `/search?q=<text>` (existing behavior preserved).
- [ ] Press Enter with empty input → nothing happens.

- [ ] **Step 4: Verify ARIA / accessibility (optional sanity check)**

Open DevTools Elements tab while the dropdown is open and confirm:

- [ ] `<input>` has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded="true"`, `aria-controls="search-autocomplete-listbox"`.
- [ ] When an item is highlighted, `aria-activedescendant` on input matches the highlighted `<button>`'s `id`.
- [ ] `<ul>` has `role="listbox"` and `id="search-autocomplete-listbox"`.
- [ ] Each `<button>` has `role="option"` and the highlighted one has `aria-selected="true"`.

- [ ] **Step 5: Stop dev server**

Stop with Ctrl+C. No commit in this task — verification only.

---

## Self-Review Notes

**Spec coverage:**
- Section 1 (목적): Tasks 2–4 implement input + dropdown + keyboard nav + Enter dispatch. ✓
- Section 2 (범위): Desktop only, title-only, max 5, no highlight — all consistent across tasks. Mobile explicitly preserved in Task 4. ✓
- Section 3 (컴포넌트 구조): Files match exactly. ✓
- Section 4 (데이터 페칭): `searchQueryOptions(query, "title", 0)` + `enabled` + `staleTime` per spec; `useDebounce` per spec. ✓
- Section 5 (표시 조건): `isFocused && debouncedQuery.trim().length > 0 && items.length > 0` matches. ✓
- Section 6 (인터랙션): All key bindings (↑/↓/Enter/ESC) and mouse handlers (`onMouseEnter`, `onMouseDown` blur-prevention, outside click) implemented in Task 3. Selection reset on query change ✓. Verification covered in Task 5. ✓
- Section 7 (UI/스타일): Tailwind classes (`relative`, `absolute top-full left-0 right-0 mt-1 z-50`, `bg-popover`, `bg-accent`) match spec exactly. ✓
- Section 8 (ARIA): All combobox attributes set in Task 3, verified in Task 5 step 4. ✓
- Section 9 (변경 파일): Matches table exactly. ✓
- Section 10 (비기능): Debounce + caching + `enabled: false` when query empty — all implemented. No new deps. ✓
- Section 11 (테스트 계획): All 14 spec scenarios mapped to Task 5 checklist items. ✓

**Placeholder scan:** No TBDs, no "implement later", no "similar to Task N" without code. All code shown in full. ✓

**Type/name consistency:**
- `searchQueryOptions(query, "title", 0)` — matches `entities/search/model/query.ts` signature `(query, type, page)`. ✓
- `data?.data?.docs` — matches `ApiResponse<SearchResponse>` shape (response wraps `{ docs, total }` in `data`). ✓
- `doc.id: number` — matches `DocumentType.id: number`. ✓
- `LISTBOX_ID` and `itemId()` are defined once and reused consistently across input ARIA props and `<ul>`/`<button>` IDs. ✓
- `closeDropdown` helper used by both `goToDoc` and `goToSearch` — consistent reset of `isFocused` and `selectedIndex`. ✓

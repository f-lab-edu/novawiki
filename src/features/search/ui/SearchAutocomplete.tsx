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
          role="combobox"
          aria-autocomplete="list"
          aria-controls={LISTBOX_ID}
          aria-expanded={isOpen}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {isOpen && (
        <div
          id={LISTBOX_ID}
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover text-popover-foreground border rounded-md shadow-md overflow-hidden"
        >
          {items.map((doc) => (
            <button
              key={doc.id}
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
          ))}
        </div>
      )}
    </div>
  );
}

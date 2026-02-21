"use client";

import Link from "next/link";
import { Button } from "@/components";
import type { DocumentType } from "@/entities";
import { SearchResultCard } from "./ui/SearchResultCard";
import { SearchResultSection } from "./ui/SearchResultSection";

type SearchResultGroupProps = {
  title: string;
  results: DocumentType[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
  searchQuery: string;
};

export function SearchResultGroup({
  title,
  results,
  hasMore = false,
  onLoadMore,
  isLoading = false,
  searchQuery,
}: SearchResultGroupProps) {
  const isEmpty = results.length === 0;

  return (
    <SearchResultSection title={title}>
      {isEmpty ? (
        <div className="flex flex-col items-center gap-2 justify-center rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">검색결과가 없습니다.</p>
          <Link
            href={`/e/new?title=${encodeURIComponent(searchQuery)}`}
            className="mt-4"
          >
            <Button className="cursor-pointer">문서 생성</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.map((doc) => (
            <SearchResultCard key={doc.id} doc={doc} />
          ))}
          {hasMore && (
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              onClick={onLoadMore}
              disabled={isLoading}
            >
              {isLoading ? "불러오는 중..." : "더 보기"}
            </Button>
          )}
        </div>
      )}
    </SearchResultSection>
  );
}

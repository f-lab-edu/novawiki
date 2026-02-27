"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { DocumentType } from "@/entities";
import { SearchResultGroup } from "@/features";
import { searchInfiniteQueryOptions } from "./model/query";

type SearchResultViewProps = {
  initialTitle: DocumentType[];
  titleTotal: number;
  initialContent: DocumentType[];
  contentTotal: number;
  searchQuery: string;
};

export function SearchResultView({
  initialTitle,
  titleTotal,
  initialContent,
  contentTotal,
  searchQuery,
}: SearchResultViewProps) {
  const {
    data: titleData,
    fetchNextPage: fetchMoreTitle,
    hasNextPage: hasTitleNextPage,
    isFetchingNextPage: isTitleFetching,
  } = useInfiniteQuery({
    ...searchInfiniteQueryOptions({ query: searchQuery, type: "title", total: titleTotal }),
    initialData: { pages: [initialTitle], pageParams: [1] },
  });

  const {
    data: contentData,
    fetchNextPage: fetchMoreContent,
    hasNextPage: hasContentNextPage,
    isFetchingNextPage: isContentFetching,
  } = useInfiniteQuery({
    ...searchInfiniteQueryOptions({ query: searchQuery, type: "content", total: contentTotal }),
    initialData: { pages: [initialContent], pageParams: [1] },
  });

  const titleDocs = titleData.pages.flat();
  const contentDocs = contentData.pages.flat();

  return (
    <div className="flex flex-col gap-10">
      <SearchResultGroup
        title={`'${searchQuery}'에 대한 문서명 검색 결과`}
        results={titleDocs}
        hasMore={hasTitleNextPage}
        onLoadMore={() => fetchMoreTitle()}
        isLoading={isTitleFetching}
        searchQuery={searchQuery}
      />

      <SearchResultGroup
        title={`'${searchQuery}'에 대한 문서내용 검색 결과`}
        results={contentDocs}
        hasMore={hasContentNextPage}
        onLoadMore={() => fetchMoreContent()}
        isLoading={isContentFetching}
        searchQuery={searchQuery}
      />
    </div>
  );
}

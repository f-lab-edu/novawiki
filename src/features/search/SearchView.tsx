"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { searchInfiniteQueryOptions } from "@/entities";
import { SearchResultGroup } from "./ui/SearchResultGroup";

type SearchViewProps = {
  searchQuery: string;
};

export function SearchView({ searchQuery }: SearchViewProps) {
  const {
    data: titleData,
    fetchNextPage: fetchMoreTitle,
    hasNextPage: hasTitleNextPage,
    isFetchingNextPage: isTitleFetching,
  } = useInfiniteQuery(
    searchInfiniteQueryOptions({ query: searchQuery, type: "title" }),
  );

  const {
    data: contentData,
    fetchNextPage: fetchMoreContent,
    hasNextPage: hasContentNextPage,
    isFetchingNextPage: isContentFetching,
  } = useInfiniteQuery(
    searchInfiniteQueryOptions({ query: searchQuery, type: "content" }),
  );

  const titleDocs = titleData?.pages.flatMap((p) => p.docs) ?? [];
  const contentDocs = contentData?.pages.flatMap((p) => p.docs) ?? [];

  return (
    <div className="px-4 sm:px-0 w-full max-w-300 mx-auto flex flex-col gap-10">
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
    </div>
  );
}

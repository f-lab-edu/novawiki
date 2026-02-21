"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import type { ApiResponse, DocumentType, SearchResponse } from "@/entities";
import { SearchResultGroup } from "@/features";
import { fetcher } from "@/lib/utils/fetcher";

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
    queryKey: ["search", "title", searchQuery],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data }: ApiResponse<SearchResponse<DocumentType>> = await fetcher(
        `/api/document/search?q=${encodeURIComponent(searchQuery)}&type=title&page=${pageParam}`,
      );
      if (!data) return [];
      return data.title.docs;
    },
    getNextPageParam: (_lastPage, allPages) => {
      const totalFetched = allPages.flat().length;
      return totalFetched < titleTotal ? allPages.length : undefined;
    },
    initialPageParam: 1,
    initialData: { pages: [initialTitle], pageParams: [0] },
  });

  const {
    data: contentData,
    fetchNextPage: fetchMoreContent,
    hasNextPage: hasContentNextPage,
    isFetchingNextPage: isContentFetching,
  } = useInfiniteQuery({
    queryKey: ["search", "content", searchQuery],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data }: ApiResponse<SearchResponse<DocumentType>> = await fetcher(
        `/api/document/search?q=${encodeURIComponent(searchQuery)}&type=content&page=${pageParam}`,
      );
      if (!data) return [];
      return data.content.docs;
    },
    getNextPageParam: (_lastPage, allPages) => {
      const totalFetched = allPages.flat().length;
      return totalFetched < contentTotal ? allPages.length : undefined;
    },
    initialPageParam: 1,
    initialData: { pages: [initialContent], pageParams: [0] },
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

import type { ApiResponse, DocumentType, SearchResponse } from "@/entities";
import { infiniteQueryOptions } from "@tanstack/react-query";
import { defaultQueryKey, defaultQueryOptions } from "@/lib/utils/query";
import { fetcher } from "@/lib/utils/fetcher";

type SearchQueryType = "title" | "content";

const searchQueryKey = (query: string, type?: SearchQueryType, page?: number) =>
  defaultQueryKey(["search", type, query, page]);

export const searchQueryOptions = (
  query: string,
  type?: SearchQueryType,
  page?: number,
) =>
  defaultQueryOptions<DocumentType[]>(
    searchQueryKey(query, type, page),
    `/api/document/search?q=${encodeURIComponent(query)}&type=${type}&page=${page}`,
  );

export const searchInfiniteQueryOptions = ({
  query,
  type,
  total,
}: {
  query: string;
  type: SearchQueryType;
  total: number;
}) =>
  infiniteQueryOptions({
    queryKey: ["search", type, query],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data }: ApiResponse<SearchResponse<DocumentType>> = await fetcher(
        `/api/document/search?q=${encodeURIComponent(query)}&type=${type}&page=${pageParam}`,
      );
      return data?.[type].docs ?? [];
    },
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      const totalFetched = allPages.flat().length;
      return totalFetched < total ? allPages.length + 1 : undefined;
    },
  });

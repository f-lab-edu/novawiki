import { infiniteQueryOptions } from "@tanstack/react-query";
import type { ApiResponse, SearchResponse } from "@/entities";
import { fetcher } from "@/lib/utils/fetcher";
import { defaultQueryKey, defaultQueryOptions } from "@/lib/utils/query";
import type { DocumentType } from "@/types";

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
}: {
  query: string;
  type: SearchQueryType;
}) =>
  infiniteQueryOptions({
    queryKey: ["search", type, query],
    queryFn: async ({ pageParam }: { pageParam: number }) => {
      const { data }: ApiResponse<SearchResponse> = await fetcher(
        `/api/document/search?q=${encodeURIComponent(query)}&type=${type}&page=${pageParam}`,
      );
      return {
        docs: data?.docs ?? [],
        total: data?.total ?? 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.flatMap((p) => p.docs).length;
      return totalFetched < lastPage.total ? allPages.length : undefined;
    },
  });

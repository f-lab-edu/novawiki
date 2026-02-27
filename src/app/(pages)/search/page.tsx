import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { ApiResponse, DocumentType, SearchResponse } from "@/entities";
import { SearchResultView, searchQueryOptions } from "@/features";
import { fetcher } from "@/lib/utils/fetcher";

async function getSearchDocs(
  q: string,
): Promise<ApiResponse<SearchResponse<DocumentType>>> {
  return fetcher(`/api/document/search?q=${encodeURIComponent(q)}`);
}

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="w-full max-w-300 mx-auto flex flex-col gap-10">
        <div className="text-center text-muted-foreground py-20">
          검색어를 입력하세요
        </div>
      </div>
    );
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(searchQueryOptions(q));

  const { data } = await getSearchDocs(q);
  if (!data) return null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full max-w-300 mx-auto flex flex-col gap-10">
        <SearchResultView
          initialTitle={data.title.docs}
          titleTotal={data.title.total}
          initialContent={data.content.docs}
          contentTotal={data.content.total}
          searchQuery={q}
        />
      </div>
    </HydrationBoundary>
  );
}

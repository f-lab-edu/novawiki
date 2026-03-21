import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { searchInfiniteQueryOptions } from "@/entities";
import { SearchView } from "@/features";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q) {
    return (
      <div className="w-full max-w-300 px-4 sm:px-0 mx-auto flex flex-col gap-10">
        <div className="text-sm sm:text-base text-center text-muted-foreground py-20">
          검색어를 입력하세요
        </div>
      </div>
    );
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery(
      searchInfiniteQueryOptions({ query: q, type: "title" }),
    ),
    queryClient.prefetchInfiniteQuery(
      searchInfiniteQueryOptions({ query: q, type: "content" }),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchView searchQuery={q} />
    </HydrationBoundary>
  );
}

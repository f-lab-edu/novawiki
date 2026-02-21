import type { ApiResponse, DocumentType, SearchResponse } from "@/entities";
import { fetcher } from "@/lib/utils/fetcher";
import { SearchResultView } from "@/widgets";

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

  const { data } = await getSearchDocs(q);
  if (!data) return null;

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-10">
      <SearchResultView
        initialTitle={data.title.docs}
        titleTotal={data.title.total}
        initialContent={data.content.docs}
        contentTotal={data.content.total}
        searchQuery={q}
      />
    </div>
  );
}

import { DocumentType } from "@/entities";
import { SearchResultSection } from "@/features";
import { fetcher } from "@/lib/utils/fetcher";

async function getSearchDocs(
  q: string
): Promise<[DocumentType[], DocumentType[]]> {
  const data = await fetcher(`/api/document/search?q=${q}`);
  return data;
}

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [titleDocs, contentDocs] = await getSearchDocs(q || "");

  // query 로 검색 API 요청
  const titleResults = titleDocs ? titleDocs : ([] as DocumentType[]);
  const contentResults = contentDocs ? contentDocs : ([] as DocumentType[]);
  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-10">
      {q && (
        <div className="flex flex-col gap-10">
          <SearchResultSection
            title={`'${q}'에 대한 문서명 검색 결과`}
            results={titleResults}
            searchQuery={q}
          />

          <SearchResultSection
            title={`'${q}'에 대한 문서내용 검색 결과`}
            results={contentResults}
            searchQuery={q}
          />
        </div>
      )}

      {!q && (
        <div className="text-center text-muted-foreground py-20">
          검색어를 입력하세요
        </div>
      )}
    </div>
  );
}

import { DocumentType } from "@/entities";
import { SearchResultSection } from "@/features";

async function getSearchDocs(
  q: string
): Promise<[DocumentType[], DocumentType[]]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/document/search?q=${q}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch search docs");
  return res.json();
}

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [titleDocs, contentDocs] = await getSearchDocs(q || "");

  // query 로 검색 API 요청
  const titleResults = q ? titleDocs : ([] as DocumentType[]);
  const contentResults = q ? contentDocs : ([] as DocumentType[]);
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

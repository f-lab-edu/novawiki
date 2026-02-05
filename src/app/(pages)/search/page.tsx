import { SearchResultSection } from "@/features";

const mockTitleResults = [
  {
    id: "1",
    title: "React",
    summary:
      "React는 사용자 인터페이스를 구축하기 위한 JavaScript 라이브러리...",
  },
  {
    id: "2",
    title: "React Native",
    summary: "React Native는 모바일 앱을 개발하기 위한 프레임워크...",
  },
];

const mockContentResults = [
  {
    id: "3",
    title: "JavaScript 기초",
    summary: "...React를 배우기 전에 JavaScript 기초를 익혀야 합니다...",
  },
  {
    id: "4",
    title: "프론트엔드 개발",
    summary: "...최근에는 React, Vue, Angular 등의 프레임워크가 인기입니다...",
  },
];

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  // query 로 검색 API 요청
  const titleResults = query ? mockTitleResults : [];
  const contentResults = query ? mockContentResults : [];
  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-10">
      {query && (
        <div className="flex flex-col gap-10">
          <SearchResultSection
            title={`'${query}'에 대한 문서명 검색 결과`}
            results={titleResults}
            searchQuery={query}
          />

          <SearchResultSection
            title={`'${query}'에 대한 문서내용 검색 결과`}
            results={contentResults}
            searchQuery={query}
          />
        </div>
      )}

      {!query && (
        <div className="text-center text-muted-foreground py-20">
          검색어를 입력하세요
        </div>
      )}
    </div>
  );
}

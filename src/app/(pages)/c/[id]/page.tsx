import Link from "next/link";
import { Button } from "@/components";
import { WikiDiffer } from "@/features";

const mockVersions: Record<number, string> = {
  30: `## 개요

위키는 여러 사람이 함께 문서를 작성하는 시스템이다.

## 특징

- 누구나 편집 가능
- 버전 관리 지원`,
  50: `## 개요

위키는 여러 사용자가 함께 문서를 수정하고 관리하는 협업 시스템이다.

## 특징

- 누구나 편집 가능
- 버전 관리 지원
- 변경 이력 추적

## 제목
`,
};

export default async function Compare({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ prev?: string; next?: string }>;
}) {
  const { id } = await params;
  const { prev = "30", next = "50" } = await searchParams;

  // TODO : id와 버전으로 문서 데이터 fetch
  const documentTitle = "React";
  // TODO : Prev가 Next보다 크다면 서로 값 변경 필요
  const oldText = mockVersions[Number(prev)] || mockVersions[30];
  const newText = mockVersions[Number(next)] || mockVersions[50];

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          &apos;{documentTitle}&apos; 문서 비교
        </h1>
        <Link href={`/d/${id}`}>
          <Button className="cursor-pointer">최신 문서로</Button>
        </Link>
      </div>

      {/* 버전 비교 */}
      <WikiDiffer
        oldText={oldText}
        newText={newText}
        oldVersion={`v${prev}`}
        newVersion={`v${next}`}
      />
      {/* 버전별 액션 버튼 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Link href={`/d/${id}?v=${prev}`}>
            <Button variant="outline" className="w-full cursor-pointer">
              v{prev} 버전 보기
            </Button>
          </Link>
        </div>
        <div className="flex-1">
          <Link href={`/d/${id}?v=${next}`}>
            <Button variant="outline" className="w-full cursor-pointer">
              v{next} 버전 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

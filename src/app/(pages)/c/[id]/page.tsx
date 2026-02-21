import Link from "next/link";
import { Button } from "@/components";
import type { ApiResponse, HistoryType } from "@/entities";
import { WikiDiffer } from "@/features";
import { fetcher } from "@/lib/utils/fetcher";

async function getCompare(
  prev: number,
  next: number,
  id: string,
): Promise<ApiResponse<HistoryType[]>> {
  return fetcher(`/api/document/compare?prev=${prev}&next=${next}&id=${id}`);
}

export default async function Compare({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ prev?: string; next?: string }>;
}) {
  const { id } = await params;
  const { prev, next } = await searchParams;

  if (!prev || !next) {
    return <div>잘못된 접근 방법입니다.</div>;
  }

  const title = decodeURI(id);
  const { data, errorCode } = await getCompare(Number(prev), Number(next), id);

  if (errorCode) {
    return <div>오류가 발생했습니다.</div>;
  }

  if (!data) {
    return <div>존재하지 않는 문서입니다.</div>;
  }

  const prevData = data[0];
  const nextData = data[1];

  if (!prevData || !nextData) {
    return <div>비교할 버전 데이터가 부족합니다.</div>;
  }

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">&apos;{title}&apos; 문서 비교</h1>
        <Link href={`/d/${title}`}>
          <Button className="cursor-pointer">최신 문서로</Button>
        </Link>
      </div>

      {/* 버전 비교 */}
      <WikiDiffer
        oldText={prevData.content}
        newText={nextData.content}
        oldVersion={`v${prevData.version}`}
        newVersion={`v${nextData.version}`}
      />
      {/* 버전별 액션 버튼 */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Link href={`/d/${id}?v=${prev}`}>
            <Button variant="outline" className="w-full cursor-pointer">
              v{prevData.version} 버전 보기
            </Button>
          </Link>
        </div>
        <div className="flex-1">
          <Link href={`/d/${id}?v=${next}`}>
            <Button variant="outline" className="w-full cursor-pointer">
              v{nextData.version} 버전 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { ApiResponse, DocumentType } from "@/entities";
import { DocumentHeader, DocumentVersionBanner, WikiViewer } from "@/features";
import { parseHeads } from "@/lib/utils/common";
import { fetcher } from "@/lib/utils/fetcher";

async function getDoc(id: string): Promise<ApiResponse<DocumentType>> {
  return fetcher(`/api/document/doc?id=${id}`);
}

async function getHistoryDoc(
  id: string,
  v: string,
): Promise<ApiResponse<DocumentType>> {
  return fetcher(`/api/document/version?id=${id}&v=${v}`);
}

export default async function Document({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { id } = await params;
  const { v } = await searchParams;

  // 버전으로 과거 데이터 혹은 미래 데이터(존재하지 않음)을 보려고 할 떄
  const isOld = !!v;

  const { data } = isOld ? await getHistoryDoc(id, v) : await getDoc(id);
  if (!data) {
    if (isOld) {
      return <div>존재하지 않는 문서이거나, 존재하지 않는 버전입니다.</div>;
    } else {
      return <div>존재하지 않는 문서입니다.</div>;
    }
  }

  // 목차 파싱
  const indexList = parseHeads(data.content);

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6 relative">
      {/* 구버전 열람 안내 배너 */}
      {isOld && <DocumentVersionBanner doc={data} id={id} />}

      {/* 제목, 문서정보, 버튼박스 */}
      <DocumentHeader doc={data} isOld={isOld} />

      {/* 문서 내용 + 목차 */}
      <div className="flex gap-6">
        {/* 본문 영역 */}
        <div className="flex-1 min-w-0">
          <WikiViewer content={data.content} />
        </div>

        {/* 목차 사이드바 */}
        <nav className="w-50 shrink-0 absolute -right-60">
          <div className="sticky top-6 rounded-lg border p-4">
            <h3 className="font-semibold mb-3">목차</h3>
            <ol className="flex flex-col gap-2 text-sm text-muted-foreground">
              {indexList.map((item, index) => (
                <li key={item.title}>
                  <Link
                    href={`#${item.title}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {index + 1}. {item.title}
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </div>
    </div>
  );
}

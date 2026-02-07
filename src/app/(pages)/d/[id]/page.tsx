import { Button } from "@/components";
import { DocumentType } from "@/entities";
import { WikiViewer } from "@/features";
import { parseHeads } from "@/lib/utils/common";
import Link from "next/link";

async function getDoc(id: string): Promise<DocumentType> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/document/doc?id=${id}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch doc");
  return res.json();
}

export default async function Document({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // 문서 가져오기
  const doc = await getDoc(id);

  if (!doc) {
    return <div>존재하지 않는 문서입니다.</div>;
  }

  // 목차 파싱
  const indexList = parseHeads(doc.content);

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col gap-6">
      {/* 제목, 문서정보, 버튼박스 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{doc.title}</h1>
          <div className="flex items-center gap-2">
            <Link href={`/e/${id}`}>
              <Button variant="outline" size="sm">
                수정
              </Button>
            </Link>
            <Button variant="outline" size="sm">
              삭제
            </Button>
            <Link href={`/h/${id}`}>
              <Button variant="outline" size="sm">
                역사
              </Button>
            </Link>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          최종 수정: {doc.updated_at}
        </div>
      </div>

      {/* 문서 내용 + 목차 */}
      <div className="flex gap-6">
        {/* 본문 영역 */}
        <div className="flex-1 min-w-0">
          <WikiViewer content={doc.content} />
        </div>

        {/* 목차 사이드바 */}
        <nav className="w-40 shrink-0">
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

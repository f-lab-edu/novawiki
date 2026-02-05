import { HistoryList } from "@/features";

const mockHistory = [
  {
    version: 5,
    date: "2026-01-26",
    user: "사용자A",
    action: "수정",
    comment: "테스트용 문서입니다",
  },
  {
    version: 4,
    date: "2026-01-25",
    user: "사용자B",
    action: "수정",
    comment: "테스트용 문서입니다",
  },
  {
    version: 3,
    date: "2026-01-24",
    user: "사용자A",
    action: "수정",
    comment: "테스트용 문서입니다",
  },
  {
    version: 2,
    date: "2026-01-23",
    user: "사용자C",
    action: "수정",
    comment: "테스트용 문서입니다",
  },
  {
    version: 1,
    date: "2026-01-22",
    user: "사용자A",
    action: "생성",
    comment: "테스트용 문서입니다",
  },
];

export default async function History({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: id로 문서 이력 데이터 fetch
  const documentTitle = "React";
  const history = mockHistory;

  return (
    <HistoryList
      documentId={id}
      documentTitle={documentTitle}
      history={history}
    />
  );
}

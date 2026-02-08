import { DocumentType } from "@/entities";
import { WikiEditForm } from "@/features";
import { fetcher } from "@/lib/utils/fetcher";

async function getDoc(id: string): Promise<DocumentType> {
  const data = await fetcher(`/api/document/doc?id=${id}`);
  return data;
}

export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // 문서 가져오기
  const doc = await getDoc(id);

  // 새 문서로 작성할지 확인
  const isNew = id === "new" || !doc;

  // TODO: id로 문서 데이터 fetch (신규면 빈 값)
  const title = isNew ? "" : doc.title;
  const content = isNew ? "" : doc.content;

  return (
    <WikiEditForm initialTitle={title} initialContent={content} isNew={isNew} />
  );
}

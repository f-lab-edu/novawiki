import { DocumentType } from "@/entities";
import { WikiEditForm } from "@/features";

async function getDoc(id: string): Promise<DocumentType> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/document/doc?id=${id}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch doc");
  return res.json();
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
    <WikiEditForm
      documentId={id}
      initialTitle={title}
      initialContent={content}
      isNew={isNew}
    />
  );
}

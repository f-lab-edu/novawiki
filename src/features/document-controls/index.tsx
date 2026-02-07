"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components";
import Link from "next/link";
import { simpleMessageToast } from "@/lib/utils/common";
import { useUserStore } from "@/store/useUserStore";
import { DocumentType } from "@/entities";

type DocumentControlsProps = {
  doc: DocumentType;
};

export function DocumentControls({ doc }: DocumentControlsProps) {
  const router = useRouter();
  const { user } = useUserStore();

  const handleClickEdit = (id: string) => {
    if (user) {
      router.push(`/e/${id}`);
      return;
    }
    simpleMessageToast("수정불가", "로그인한 유저만 수정할 수 있습니다.");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{doc.title}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClickEdit(doc.title)}
          >
            수정
          </Button>
          <Button variant="outline" size="sm">
            삭제
          </Button>
          <Link href={`/h/${doc.title}`}>
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
  );
}

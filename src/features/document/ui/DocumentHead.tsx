"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/app/actions/document";
import { Button } from "@/components";
import type { DocumentType } from "@/entities";
import { formatDateTime, simpleMessageToast } from "@/lib/utils/common";
import { useUserStore } from "@/store/useUserStore";

type DocumentHeadProps = {
  doc: DocumentType;
  isOld: boolean;
};

export function DocumentHead({ doc, isOld }: DocumentHeadProps) {
  const router = useRouter();
  const { user } = useUserStore();

  const handleClickEdit = (id: string) => {
    if (user) {
      router.push(`/e/${id}`);
      return;
    }
    simpleMessageToast("수정 불가", "로그인한 유저만 수정할 수 있습니다.");
  };

  const handleClickDelete = async (id: string) => {
    if (!user) {
      simpleMessageToast("삭제 불가", "로그인한 유저만 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm(`'${id}' 문서를 삭제하시겠습니까?`)) return;

    const { error } = await deleteDocument(id);

    if (error) {
      simpleMessageToast("삭제 실패", error);
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isOld ? doc.document?.title : doc.title}
        </h1>
        {!isOld ? (
          <div className="flex items-center gap-2">
            {/* 수정 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClickEdit(doc.title)}
              className="cursor-pointer"
            >
              수정
            </Button>
            {/* 삭제 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleClickDelete(doc.title)}
              className="cursor-pointer"
            >
              삭제
            </Button>
            {/* 역사 */}
            <Link href={`/h/${doc.title}`} scroll>
              <Button variant="outline" size="sm" className="cursor-pointer">
                역사
              </Button>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
      {!isOld ? (
        <div className="text-sm text-muted-foreground">
          최종 수정: {formatDateTime(doc.updated_at)}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

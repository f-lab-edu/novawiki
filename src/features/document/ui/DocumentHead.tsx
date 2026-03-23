"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/app/actions/document";
import { Button } from "@/components";
import { ButtonGroup } from "@/components/ui/shadcn/button-group";
import { formatDateTime, simpleMessageToast } from "@/lib/utils/common";
import { useUserStore } from "@/store/useUserStore";
import type { DocumentType } from "@/types";

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
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between">
        <h1 className="w-full text-2xl sm:text-4xl font-semibold">
          {isOld ? doc.document?.title : doc.title}
        </h1>
        {!isOld ? (
          <ButtonGroup className="mb-4! sm:m-0 w-full justify-end sm:items-center">
            {/* 수정 */}
            <Button
              variant="outline"
              onClick={() => handleClickEdit(doc.title)}
              className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
            >
              수정
            </Button>
            {/* 삭제 */}
            <Button
              variant="outline"
              onClick={() => handleClickDelete(doc.title)}
              className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
            >
              삭제
            </Button>
            {/* 역사 */}
            <Button
              onClick={() => router.push(`/h/${doc.title}`)}
              variant="outline"
              className="cursor-pointer h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
            >
              역사
            </Button>
          </ButtonGroup>
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

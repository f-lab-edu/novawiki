"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { writeDocument } from "@/app/actions/document";
import { Button } from "@/components";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { documentQueryOptions } from "@/entities";
import { documentQueryKey } from "@/entities/document/model/query";
import { simpleMessageToast } from "@/lib/utils/common";
import { WikiEditor } from "../wiki-editor";

type EditFormProps = {
  id: string;
};

export function EditForm({ id }: EditFormProps) {
  const { data: response } = useQuery(documentQueryOptions(id));
  const doc = response?.data;
  const isDeleted = !!doc && !doc.isDisplay;
  const isNew = id === "new" || (!doc && !isDeleted);

  const queryClient = useQueryClient();
  const router = useRouter();
  const [title, setTitle] = useState(doc?.title ?? "");
  const [content, setContent] = useState(doc?.content ?? "");
  const [comment, setComment] = useState("");
  const [agreed, setAgreed] = useState(false);

  const confirmedRef = useRef(false);
  useEffect(() => {
    if (!isDeleted || confirmedRef.current) return;
    confirmedRef.current = true;
    const load = window.confirm(
      "과거에 생성 이력이 있습니다. 내용을 불러오시겠습니까?",
    );
    if (!load) setContent("");
  }, [isDeleted]);

  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (isNew) {
      router.push("/");
    } else {
      router.push(`/d/${title}`);
    }
  };

  const handleAction = async (formData: FormData) => {
    startTransition(async () => {
      const { error, success, isExisting } = await writeDocument(
        { error: null },
        formData,
      );
      // 성공
      if (success) {
        queryClient.invalidateQueries({
          queryKey: documentQueryKey(id),
        });
        router.push(`/d/${title}`);
        return;
      }
      // 이미 존재하는 문서
      if (isExisting && error) {
        simpleMessageToast("저장 오류", error);
        router.push(`/h/${title}`);
        return;
      }
      // 알 수 없는 오류
      if (error) {
        simpleMessageToast("저장 오류", error);
        return;
      }
    });
  };

  return (
    <form
      action={handleAction}
      className="px-4 sm:px-0 w-full max-w-300 mx-auto flex flex-col gap-6"
    >
      {/* hidden inputs */}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="isNew" value={isNew ? "true" : "false"} />

      {/* 문서 제목 */}
      <Input
        type="text"
        name="title"
        placeholder="문서 제목 입력"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        readOnly={!isNew}
        className="text-lg h-10"
      />

      {/* 마크다운 에디터 + 미리보기 */}
      <WikiEditor value={content} onChange={setContent} />

      {/* 코멘트 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="edit-comment" className="text-sm font-medium">
          코멘트
        </label>
        <Textarea
          id="edit-comment"
          name="comment"
          placeholder="수정된 내용에 대한 설명을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="text-sm"
        />
      </div>

      {/* 동의 체크박스 + 저장/취소 */}
      <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-0">
        <label className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="size-3 sm:size-4 cursor-pointer"
          />
          저장하면 사용자 ID로 영구히 기록됩니다. 동의하십니까?
        </label>
        <div className="justify-end flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={!agreed || !title.trim() || isPending}
          >
            {isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { writeDocument } from "@/app/actions/document";
import { Button } from "@/components";
import { Input } from "@/components/ui/shadcn/input";
import { Textarea } from "@/components/ui/shadcn/textarea";
import { simpleMessageToast } from "@/lib/utils/common";
import { WikiEditor } from "../wiki-editor";

type WikiEditFormProps = {
  initialTitle: string;
  initialContent: string;
  isNew: boolean;
};

export function WikiEditForm({
  initialTitle,
  initialContent,
  isNew,
}: WikiEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [comment, setComment] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [state, formAction, isPending] = useActionState(writeDocument, {
    error: null,
  });

  const handleCancel = () => {
    if (isNew) {
      router.push("/");
    } else {
      router.push(`/d/${initialTitle}`);
    }
  };

  useEffect(() => {
    const { error, isExisting, success } = state;
    if (success) {
      router.push(`/d/${title}`);
    }
    if (isExisting) {
      router.push(`/h/${title}`);
    }
    if (!error) return;
    simpleMessageToast("오류", error);
  }, [state]);

  // 폼 저장
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="w-full max-w-300 mx-auto flex flex-col gap-6"
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
        className="text-lg h-12"
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
        />
      </div>

      {/* 에러 메시지 */}
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      {/* 동의 체크박스 + 저장/취소 */}
      <div className="flex items-center justify-between border-t pt-4">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="size-4 cursor-pointer"
          />
          저장하면 사용자 ID로 영구히 기록됩니다. 동의하십니까?
        </label>
        <div className="flex items-center gap-2">
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

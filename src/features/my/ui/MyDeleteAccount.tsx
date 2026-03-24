"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/actions/user";
import { Button } from "@/components";
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { simpleMessageToast } from "@/lib/utils/common";
import { useUserStore } from "@/store/useUserStore";

interface MyDeleteAccountProps {
  nick: string;
}

export function MyDeleteAccount({ nick }: MyDeleteAccountProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { clearUser } = useUserStore();

  const handleDelete = async () => {
    const result = await deleteAccount();
    if (result?.error) {
      simpleMessageToast("오류", result.error);
      return;
    }
    clearUser();
  };

  if (!open) {
    return (
      <Button
        type="button"
        variant="outline"
        className="w-full cursor-pointer text-destructive border-destructive hover:bg-destructive/5"
        onClick={() => setOpen(true)}
      >
        회원탈퇴
      </Button>
    );
  }

  return (
    <FieldGroup>
      <FieldDescription className="text-destructive font-medium">
        탈퇴 후 계정은 복구할 수 없습니다. <br />
        단, 위키 기여 내용과 채팅 기록은 삭제되지 않습니다.
        <br />
        <br />
        확인을 위해 닉네임({nick})을 입력해주세요.
      </FieldDescription>
      <Field>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={nick}
          className="text-sm"
        />
      </Field>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={() => {
            setOpen(false);
            setInput("");
          }}
        >
          취소
        </Button>
        <Button
          type="button"
          className="flex-1 cursor-pointer bg-destructive hover:bg-destructive/90"
          disabled={input !== nick}
          onClick={handleDelete}
        >
          탈퇴하기
        </Button>
      </div>
    </FieldGroup>
  );
}

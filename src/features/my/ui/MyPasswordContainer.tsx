"use client";

import { useState } from "react";
import { updatePassword } from "@/app/actions/auth";
import { Button } from "@/components";
import { Field, FieldGroup } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import {
  validatePassword,
  validatePasswordChk,
} from "@/features/signup-form/utils/validate";
import { simpleMessageToast } from "@/lib/utils/common";

export function MyPasswordContainer() {
  const [newPassword, setNewPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");

  const handleAction = async (formData: FormData) => {
    const [isPwValid, pwMessage] = validatePassword(newPassword);
    if (!isPwValid) {
      simpleMessageToast("비밀번호 변경 오류", pwMessage);
      return;
    }
    const [isChkValid, chkMessage] = validatePasswordChk(
      newPassword,
      passwordChk,
    );
    if (!isChkValid) {
      simpleMessageToast("비밀번호 변경 오류", chkMessage);
      return;
    }

    const result = await updatePassword(formData);

    if (result.error) {
      simpleMessageToast("비밀번호 변경 오류", result.error);
      return;
    }
    setNewPassword("");
    setPasswordChk("");
    simpleMessageToast("비밀번호 변경 완료", "비밀번호가 변경되었습니다.");
  };

  return (
    <form action={handleAction}>
      <FieldGroup className="gap-4">
        <Field>
          <Input
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호"
            className="text-sm"
          />
        </Field>
        <Field>
          <Input
            type="password"
            value={passwordChk}
            onChange={(e) => setPasswordChk(e.target.value)}
            placeholder="새 비밀번호 확인"
            className="text-sm"
          />
        </Field>
        <Button
          type="submit"
          variant="outline"
          className="w-full cursor-pointer"
        >
          비밀번호 변경
        </Button>
      </FieldGroup>
    </form>
  );
}

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateNick } from "@/app/actions/user";
import { Button } from "@/components";
import { Field, FieldGroup } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { validateNick } from "@/features/signup-form/utils/validate";
import { simpleMessageToast } from "@/lib/utils/common";

interface MyNickContainerProps {
  currentNick: string;
}

export function MyNickContainer({ currentNick }: MyNickContainerProps) {
  const [nick, setNick] = useState(currentNick);
  const queryClient = useQueryClient();

  const handleAction = async (formData: FormData) => {
    const [isValid, message] = validateNick(nick);
    if (!isValid) {
      simpleMessageToast("닉네임 변경 오류", message);
      return;
    }

    const result = await updateNick(formData);
    if (result.error) {
      simpleMessageToast("닉네임 변경 오류", result.error);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    simpleMessageToast("닉네임 변경 완료", "닉네임이 변경되었습니다.");
  };

  return (
    <form action={handleAction}>
      <FieldGroup className="gap-4">
        <Field>
          <Input
            name="nick"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            placeholder="닉네임"
            className="text-sm"
          />
        </Field>
        <Button
          type="submit"
          variant="outline"
          className="w-full cursor-pointer"
        >
          닉네임 변경
        </Button>
      </FieldGroup>
    </form>
  );
}

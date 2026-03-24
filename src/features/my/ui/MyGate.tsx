"use client";

import { useState } from "react";
import { verifyPassword } from "@/app/actions/user";
import { Button } from "@/components";
import { Field, FieldGroup } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { simpleMessageToast } from "@/lib/utils/common";

interface MyGateProps {
  onVerified: () => void;
}

export function MyGate({ onVerified }: MyGateProps) {
  const [password, setPassword] = useState("");

  const handleAction = async (formData: FormData) => {
    const result = await verifyPassword(formData);
    if (result.error) {
      simpleMessageToast("비밀번호 오류", result.error);
      return;
    }
    onVerified();
  };

  return (
    <div className="flex justify-center">
      <form action={handleAction} className="w-full sm:w-96">
        <FieldGroup>
          <Field>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="현재 비밀번호"
              className="text-sm"
              autoFocus
            />
          </Field>
          <Button type="submit" className="w-full cursor-pointer">
            확인
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

"use client";

import { login } from "@/app/actions/auth";
import { Button, Card } from "@/components";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import { useActionState, useState } from "react";

export function LoginForm() {
  // 아이디
  const [userid, setUserid] = useState<string>("");
  // 비밀번호
  const [password, setPassword] = useState<string>("");

  // 아이디
  const handleUseridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserid(value);
  };

  // 비밀번호
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
  };

  const [state, formAction] = useActionState(login, { error: null });

  return (
    <Card className="p-7 pt-10 pb-10">
      <form action={formAction} className="w-100">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="input-field-userid">아이디</FieldLabel>
            <Input
              id="input-field-userid"
              type="text"
              name="userid"
              value={userid}
              onChange={handleUseridChange}
              placeholder="Enter your ID"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="input-field-password">비밀번호</FieldLabel>
            <Input
              id="input-field-password"
              type="password"
              name="password"
              placeholder="Enter your Password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Field>
          <FieldDescription className="text-red-500">
            {state.error}
          </FieldDescription>
          <Button type="submit" className="w-full cursor-pointer">
            로그인
          </Button>
        </FieldGroup>
      </form>
    </Card>
  );
}

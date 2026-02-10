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
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useUserStore();

  // 아이디
  const [userid, setUserid] = useState<string>("");
  // 비밀번호
  const [password, setPassword] = useState<string>("");

  // 에러
  const [error, setError] = useState<string | null>(null);

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

  const handleAction = async (formData: FormData) => {
    const result = await login({ error: null }, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.success && result.id) {
      setUser({ id: result.id });
      router.push('/');
    }
  }
  
  return (
    <Card className="p-7 pt-10 pb-10">
      <form action={handleAction} className="w-100">
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
            {error}
          </FieldDescription>
          <Button type="submit" className="w-full cursor-pointer">
            로그인
          </Button>
        </FieldGroup>
      </form>
    </Card>
  );
}

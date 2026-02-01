"use client";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export function LoginForm() {
  const [state, formAction] = useActionState(login, { error: null });
  return (
    <form action={formAction}>
      <input name="userid" type="text" placeholder="아이디" />
      <input name="password" type="password" placeholder="비밀번호" />
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

      <button type="submit">로그인</button>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/app/actions/auth";
import { Button } from "@/components";
import { Field, FieldGroup } from "@/components/ui/shadcn/field";
import { Input } from "@/components/ui/shadcn/input";
import type { ApiResponse, GoogleOAuthData } from "@/entities";
import { simpleMessageToast } from "@/lib/utils/common";
import { fetcher } from "@/lib/utils/fetcher";
import { useUserStore } from "@/store/useUserStore";

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useUserStore();

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

  const handleGoogleLogin = async () => {
    const { data, errorCode }: ApiResponse<GoogleOAuthData> =
      await fetcher("/api/auth/google");

    if (!data || errorCode) {
      simpleMessageToast("로그인 오류", "Google 로그인을 할 수 없습니다.");
      return;
    }
    const { url } = data;
    window.location.href = url;
  };

  const handleAction = async (formData: FormData) => {
    const result = await login(formData);
    if (result.error) {
      simpleMessageToast("로그인 오류", result.error);
      return;
    }
    if (result.success && result.id) {
      setUser({ id: result.id });
      router.push("/");
    }
  };

  return (
    <form action={handleAction} className="w-full sm:w-80">
      <FieldGroup className="gap-4">
        <Field>
          <Input
            id="input-field-userid"
            type="text"
            name="userid"
            value={userid}
            onChange={handleUseridChange}
            placeholder="아이디"
          />
        </Field>
        <Field>
          <Input
            id="input-field-password"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={handlePasswordChange}
          />
        </Field>

        <Button type="submit" className="w-full cursor-pointer mt-4!">
          로그인
        </Button>

        {/* 소셜 로그인 */}
        <div className="w-full flex items-center justify-center mt-2! mb-2!">
          <button
            type="button"
            className="cursor-pointer bg-white border border-gray-300 rounded-full p-2"
            onClick={handleGoogleLogin}
            aria-label="Google로 로그인"
          >
            <svg
              viewBox="0 0 48 48"
              className="w-5 h-5"
              role="img"
              aria-label="Google로 로그인"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.96 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </button>
        </div>

        <div className="text-center mt-3">
          <Link
            href="/signup"
            className="text-sm text-muted-foreground border-b border-gray-400 pb-0.5"
          >
            회원가입
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}

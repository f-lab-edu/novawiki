"use server";

import { Api } from "@/lib/api/api";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type LoginState = {
  error: string | null;
};

/** 로그인 */
export async function login(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const userid = formData.get("userid") as string;
  const password = formData.get("password") as string;
  const email = `${userid}@novawiki.com`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
    } else {
      return { error: "알 수 없는 오류가 발생했습니다." };
    }
  }

  // 성공
  redirect("/");
}

type SignUpState = {
  error: string | null;
};

/** 회원가입 */
export async function signUp(
  prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  console.log(formData);
  // FormData
  const userid = formData.get("userid") as string;
  const password = formData.get("password") as string;
  const nick = formData.get("nick") as string;

  // auth 회원가입
  const supabase = await createClient();
  const email = `${userid}@novawiki.com`;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.code === "over_email_send_rate_limit") {
      return { error: "요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요." };
    } else {
      return { error: "알 수 없는 오류가 발생했습니다." };
    }
  }

  // DB에 저장할 데이터
  const userData = {
    userid,
    email,
    nick,
  };

  const { error: dbError } = await supabase.from("user").insert(userData);

  if (dbError) {
    // DB 저장 실패 시 auth 유저 롤백
    if (data.user) {
      const adminClient = createAdminClient();
      await adminClient.auth.admin.deleteUser(data.user.id);
    }
    return { error: "회원가입에 실패했습니다." };
  }

  redirect("/");
}

/** 로그아웃 */
export async function logout() {
  await Api.auth.logout();
  redirect("/login");
}

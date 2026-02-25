"use server";

import { createClient } from "@/lib/supabase/server";

type AuthState = {
  error: string | null;
  success?: boolean;
  id?: string | null;
};

/** 로그인 */
export async function login(formData: FormData): Promise<AuthState> {
  const userid = formData.get("userid") as string;
  const password = formData.get("password") as string;
  const email = `${userid}@novawiki.com`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
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

  return { error: null, success: true, id: data.user?.id };
}

/** 회원가입 */
export async function signUp(formData: FormData): Promise<AuthState> {
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
    options: {
      data: { userid: userid, nick: nick },
    },
  });

  if (error) {
    console.log(error);
    if (error.code === "over_email_send_rate_limit") {
      return { error: "요청 횟수가 너무 많습니다. 잠시 후 다시 시도해주세요." };
    } else if (error.code === "user_already_exists") {
      return { error: "이미 사용중인 아이디입니다." };
    } else {
      return { error: "알 수 없는 오류가 발생했습니다." };
    }
  }

  return { error: null, success: true, id: data.user?.id };
}

/** 로그아웃 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

/** 비밀번호 변경 */
export async function updatePassword(formData: FormData): Promise<AuthState> {
  const newPassword = formData.get("newPassword") as string;
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) {
    return { error: "알 수 없는 오류가 발생했습니다." };
  }
  return { error: null, success: true };
}

"use server";

import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const USER_SUFFIX = `@novawiki.com`;

type ActionState = { error: string | null; success?: boolean };

/** 비밀번호 확인 (마이페이지 진입 시) */
export async function verifyPassword(formData: FormData): Promise<ActionState> {
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "로그인 후 이용해 주세요." };

  const userid = user.user_metadata?.userid as string;
  const email = `${userid}${USER_SUFFIX}`;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "비밀번호가 올바르지 않습니다." };

  return { error: null, success: true };
}

/** 닉네임 변경 */
export async function updateNick(formData: FormData): Promise<ActionState> {
  const nick = formData.get("nick") as string;

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "로그인이 필요합니다." };

  const { error: metaError } = await supabase.auth.updateUser({
    data: { nick },
  });
  if (metaError) return { error: "알 수 없는 오류가 발생했습니다." };

  const admin = createAdminClient();
  const { error: profileError } = await admin
    .from("profile")
    .update({ nick })
    .eq("id", user.id);
  if (profileError) return { error: "알 수 없는 오류가 발생했습니다." };

  return { error: null, success: true };
}

/** 프로필 사진 URL 저장 */
export async function updateAvatar(url: string): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "로그인이 필요합니다." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("profile")
    .update({ avatar_url: url })
    .eq("id", user.id);
  if (error) return { error: "알 수 없는 오류가 발생했습니다." };

  return { error: null, success: true };
}

/** 회원탈퇴 */
export async function deleteAccount(): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "로그인이 필요합니다." };

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: "알 수 없는 오류가 발생했습니다." };

  redirect("/");
}

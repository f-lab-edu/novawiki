"use server";

import { createClient } from "@/lib/supabase/server";
import { tanslatePrimaryTitle } from "@/lib/utils/common";

export interface DocumentState {
  error: string | null;
  success?: boolean;
  isExisting?: boolean;
}

/** 문서 생성/수정 */
export async function writeDocument(
  prevState: DocumentState,
  formData: FormData
): Promise<DocumentState> {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return { error: "로그인이 필요합니다." };
  }

  const { data: user } = await supabase
    .from("user")
    .select("id")
    .eq("auth_id", authUser.id)
    .maybeSingle();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  // FormData 파싱
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const comment = formData.get("comment") as string;
  const isNew = formData.get("isNew") === "true";

  // 유효성 검사
  if (!title.trim()) {
    return { error: "제목을 입력해주세요." };
  }

  if (!content.trim()) {
    return { error: "내용을 입력해주세요." };
  }

  const primaryTitle = tanslatePrimaryTitle(title);

  if (isNew) {
    // 새 문서 생성
    // 기존 문서 존재 여부 확인
    const { data: existingDoc } = await supabase
      .from("document")
      .select("id")
      .eq("primaryTitle", primaryTitle)
      .maybeSingle();

    if (existingDoc) {
      return { error: "이미 존재하는 문서입니다.", isExisting: true };
    }

    const { error: insertError } = await supabase.from("document").insert({
      title,
      primaryTitle,
      content,
      comment,
      user_id: user.id,
    });

    if (insertError) {
      return { error: "문서 생성에 실패했습니다." };
    }
  } else {
    // 기존 문서 수정 및 history 테이블 생성
    const { data, error: rpcError } = await supabase.rpc(
      "update_document_with_history",
      {
        p_primary_title: primaryTitle,
        p_content: content,
        p_comment: comment,
        p_user_id: user.id,
      }
    );
    if (rpcError) {
      return { error: "문서 수정에 실패했습니다." };
    }
  }

  // 성공 시 문서 페이지로 리다이렉트
  return { success: true, error: null };
}

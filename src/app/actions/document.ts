"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { decomposeKorean, tanslatePrimaryTitle } from "@/lib/utils/common";

export interface DocumentState {
  error: string | null;
  success?: boolean;
  isExisting?: boolean;
}

/** 문서 생성/수정 */
export async function writeDocument(
  _: DocumentState,
  formData: FormData,
): Promise<DocumentState> {
  const supabase = await createClient();

  // 현재 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
  const letters = decomposeKorean(primaryTitle);

  if (isNew) {
    const { data, error } = await supabase.rpc("create_document_with_history", {
      p_title: title,
      p_primary_title: primaryTitle,
      p_content: content,
      p_comment: comment,
      p_letters: letters,
    });

    if (error) {
      return { error: error.message };
    }

    if (!data.success) {
      // 이미 존재하는 문서
      if (data.errorCode === "DOCUMENT_ALREADY_EXISTS") {
        return { error: data.error, isExisting: true };
      }
      return { error: data.error };
    }
    return { success: true, error: null };
  } else {
    // 기존 문서 수정 및 history 테이블 생성
    const { error } = await supabase.rpc("update_document_with_history", {
      p_primary_title: primaryTitle,
      p_content: content,
      p_comment: comment,
    });
    if (error) {
      return { error: "문서 수정에 실패했습니다." };
    }
  }

  // 성공 시 문서 페이지로 리다이렉트
  return { success: true, error: null };
}

/** 문서 삭제 (soft delete - isDisplay: false) */
export async function deleteDocument(
  title: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const primaryTitle = tanslatePrimaryTitle(title);

  const { error } = await supabase.rpc("delete_document_with_history", {
    p_primary_title: primaryTitle,
    p_profile_id: user.id,
  });

  if (error) {
    return { error: "문서 삭제에 실패했습니다." };
  }

  return { error: null };
}

/** 문서 조회수 증가 (쿠키 중복 방지) */
export async function incrementView(primaryTitle: string): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  const cookieKey = `viewed_${primaryTitle}`;
  if (cookieStore.has(cookieKey)) return;

  const supabase = createAdminClient();
  await supabase.rpc("increment_view", {
    p_primary_title: decodeURIComponent(primaryTitle),
  });

  cookieStore.set(cookieKey, "1", {
    maxAge: 60 * 60 * 12,
    httpOnly: true,
    path: "/",
  });
}

/** 문서 되돌리기 */
export async function restoreDocument(
  title: string,
  targetVersion: number,
): Promise<{ error: string | null }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "로그인이 필요합니다." };
  }

  const primaryTitle = tanslatePrimaryTitle(title);

  const { error } = await supabase.rpc("restore_document_with_history", {
    p_primary_title: primaryTitle,
    p_profile_id: user.id,
    p_version: targetVersion,
  });

  if (error) {
    return { error: "되돌리기에 실패했습니다." };
  }

  return { error: null };
}

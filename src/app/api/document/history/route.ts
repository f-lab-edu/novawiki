import { createAdminClient } from "@/lib/supabase/server";
import { tanslatePrimaryTitle } from "@/lib/utils/common";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const supabase = createAdminClient();

  // 차단 확인 (block 된 문서는 역사, 비교 페이지에서도 볼 수 없음)
  const blockQuery = supabase
    .from("document")
    .select("*")
    .eq("primaryTitle", tanslatePrimaryTitle(id))
    .eq("isBlock", true)
    .maybeSingle();

  const { data: blockData, error: blockError } = await blockQuery;

  if (blockError) {
    return Response.json(
      {
        success: false,
        data: null,
        errorCode: "DB_ERROR",
        message: "데이터 조회 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }

  // 차단된 문서인 경우
  if (blockData) {
    return Response.json(
      {
        success: false,
        data: null,
        errorCode: "DOCUMENT_BLOCKED",
        message: "차단된 문서입니다.",
      },
      { status: 403 },
    );
  }

  // History 테이블 조회
  const query = supabase
    .from("history")
    .select(
      `*,
        document:document_id!inner (
          id,
          primaryTitle
        ),
        profile:history_profile_id_fkey (
          nick
        )
      `,
    )
    .eq("isBlock", false)
    .eq("document.primaryTitle", tanslatePrimaryTitle(id))
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    return Response.json(
      {
        success: false,
        data: null,
        errorCode: "DB_ERROR",
        message: "데이터 조회 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }

  return Response.json({
    success: true,
    data,
    errorCode: null,
    message: null,
  });
}

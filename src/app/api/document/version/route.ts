import { createAdminClient } from "@/lib/supabase/server";
import { tanslatePrimaryTitle } from "@/lib/utils/common";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const v = Number(searchParams.get("v"));

  const supabase = createAdminClient();

  // History 테이블 조회
  const query = supabase
    .from("history")
    .select(
      `*,
        document:document_id!inner (
          id,
          primaryTitle,
          title
        ),
        profile:history_profile_id_fkey (
          nick
        )
      `,
    )
    .eq("isBlock", false)
    .eq("document.primaryTitle", tanslatePrimaryTitle(id))
    .eq("version", v)
    .maybeSingle();

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

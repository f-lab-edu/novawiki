import { createAdminClient } from "@/lib/supabase/server";
import { tanslatePrimaryTitle } from "@/lib/utils/common";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // 문서 조회
  const supabase = createAdminClient();
  const query = supabase
    .from("document")
    .select("*")
    .eq("primaryTitle", tanslatePrimaryTitle(id))
    .eq("isBlock", false)
    .single();

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

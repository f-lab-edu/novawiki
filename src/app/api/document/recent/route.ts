import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createAdminClient();
  const query = supabase
    .from("document")
    .select(`*`)
    .eq("isBlock", false)
    .eq("isDisplay", true)
    .order("updated_at", { ascending: false })
    .limit(10);

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

import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const query = supabase
    .from("d_view")
    .select(
      `
      view,
      document!inner (
        title,
        content,
        updated_at
      )
    `,
    )
    .eq("date", today)
    .eq("document.isBlock", false)
    .eq("document.isDisplay", true)
    .order("view", { ascending: false })
    .limit(5);

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

  const flat = data.map(({ view, document }) => ({
    view,
    ...document,
  }));

  return Response.json({
    success: true,
    data: flat,
    errorCode: null,
    message: null,
  });
}

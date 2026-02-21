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
    .eq("isDisplay", true)
    .single();

  const { data, error } = await query;
  if (error) {
    console.log("DB 조회 에러", error);
    return Response.json(null, { status: 401 });
  }
  return Response.json(data);
}

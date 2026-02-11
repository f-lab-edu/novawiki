import { createClient } from "@/lib/supabase/server";

export async function GET() {
  // 작성자 정보가 필요 없으므로 adminClient 사용하지 않음
  const supabase = await createClient();
  const query = supabase
    .from("document")
    .select(`*`)
    .eq("isBlock", false)
    .eq("isDisplay", true)
    .order("updated_at", { ascending: false })
    .limit(10);
  const { data, error } = await query;
  if (error) {
    console.error("DB 조회 에러", error);
    return Response.json(null, { status: 401 });
  }
  return Response.json(data);
}

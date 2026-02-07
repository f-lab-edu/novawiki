import { createClient } from "@/lib/supabase/server";
import { decomposeKorean } from "@/lib/utils/common";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const supabase = await createClient();

  // 제목
  const titleQuery = supabase
    .from("document")
    .select("*")
    .eq("isBlock", false)
    .eq("isDisplay", true)
    .ilike("letters", `%${decomposeKorean(q)}%`)
    .order("updated_at", { ascending: false })
    .limit(10);

  const { data: titleData, error: titleError } = await titleQuery;
  if (titleError) {
    console.log("DB 조회 에러", titleError);
    return Response.json(null, { status: 401 });
  }

  // 내용
  const contentQuery = supabase
    .from("document")
    .select("*")
    .eq("isBlock", false)
    .eq("isDisplay", true)
    .ilike("content", `%${decomposeKorean(q)}%`)
    .order("updated_at", { ascending: false })
    .limit(10);

  const { data: contentData, error: contentError } = await contentQuery;
  if (contentError) {
    console.log("DB 조회 에러", contentError);
    return Response.json(null, { status: 401 });
  }

  const result = [titleData, contentData];
  return Response.json(result);
}

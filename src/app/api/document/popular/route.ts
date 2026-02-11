import { createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createAdminClient();
  const query = supabase
    .from("document")
    .select(
      `*,
      user:document_user_id_fkey (
      email,
      nick
    )
  `,
    )
    .eq("isBlock", false)
    .eq("isDisplay", true)
    .limit(10);

  const { data, error } = await query;
  if (error) {
    console.log("DB 조회 에러", error);
    return Response.json(null, { status: 401 });
  }
  return Response.json(data);
}

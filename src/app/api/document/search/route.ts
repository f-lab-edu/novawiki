import { createAdminClient } from "@/lib/supabase/server";
import { decomposeKorean } from "@/lib/utils/common";

const LIMIT = 5;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const page = Number(searchParams.get("page") ?? "0");
  const type = searchParams.get("type"); // 'title' | 'content' | null (both)
  const supabase = createAdminClient();

  const offset = page * LIMIT;

  let titleDocs: object[] = [];
  let titleTotal = 0;
  let contentDocs: object[] = [];
  let contentTotal = 0;

  if (!type || type === "title") {
    const { data, count, error } = await supabase
      .from("document")
      .select("*", { count: "exact" })
      .eq("isBlock", false)
      .eq("isDisplay", true)
      .ilike("letters", `%${decomposeKorean(q)}%`)
      .order("updated_at", { ascending: false })
      .range(offset, offset + LIMIT - 1);

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

    titleDocs = data ?? [];
    titleTotal = count ?? 0;
  }

  if (!type || type === "content") {
    const { data, count, error } = await supabase
      .from("document")
      .select("*", { count: "exact" })
      .eq("isBlock", false)
      .eq("isDisplay", true)
      .ilike("content", `%${q}%`)
      .order("updated_at", { ascending: false })
      .range(offset, offset + LIMIT - 1);

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

    contentDocs = data ?? [];
    contentTotal = count ?? 0;
  }

  return Response.json({
    success: true,
    data: {
      title: { docs: titleDocs, total: titleTotal },
      content: { docs: contentDocs, total: contentTotal },
    },
    errorCode: null,
    message: null,
  });
}

import { createAdminClient } from "@/lib/supabase/server";
import { tanslatePrimaryTitle } from "@/lib/utils/common";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  let prev = Number(searchParams.get("prev"));
  let next = Number(searchParams.get("next"));

  if (prev > next) {
    const tempNext = next;
    next = prev;
    prev = tempNext;
  }

  const supabase = createAdminClient();

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
    .in("version", [prev, next])
    .order("version", { ascending: false });

  const { data: historyData, error } = await query;

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

  // 버전 내림차순 조회 -> 1번 인덱스(next) / 0번 인덱스(prev)
  // 데이터가 1개 밖에 없다면, 같은 버전을 비교했다고 간주
  // 데이터가 0개면 없는 버전을 조회했다고 간주

  if (historyData.length === 0) {
    return Response.json(
      {
        success: true,
        data: null,
        errorCode: null,
        message: null,
      },
      { status: 400 },
    );
  }

  if (historyData.length === 1) {
    const versionData = historyData[0];
    return Response.json(
      {
        success: true,
        data: [versionData, versionData],
        errorCode: null,
        message: null,
      },
      { status: 400 },
    );
  }

  if (historyData.length !== 2) {
    return Response.json(
      {
        success: true,
        data: null,
        errorCode: null,
        message: null,
      },
      { status: 400 },
    );
  }

  const prevData = historyData[1];
  const nextData = historyData[0];

  return Response.json({
    success: true,
    data: [prevData, nextData],
    errorCode: null,
    message: null,
  });
}

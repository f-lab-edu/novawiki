import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json(
      {
        success: false,
        data: null,
        errorCode: "USER_ERROR",
        message: "존재하지 않는 계정입니다.",
      },
      { status: 401 },
    );
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profile")
    .select("id, nick, userid, avatar_url")
    .eq("id", user.id)
    .single();

  return Response.json({
    success: true,
    data: profile,
    errorCode: null,
    message: null,
  });
}

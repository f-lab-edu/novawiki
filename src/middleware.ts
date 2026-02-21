import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/server";

const requiredLoginRoutes = ["/e/*"];

export async function middleware(request: NextRequest) {
  // 로그인 여부를 확인할 페이지들
  const isRequiredLogin = requiredLoginRoutes.some((route) =>
    new RegExp(`^${route.replace("*", ".*")}$`).test(request.nextUrl.pathname),
  );

  if (!isRequiredLogin) return NextResponse.next();

  // Supabase 세션 체크
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  return NextResponse.next();
}

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "./lib/supabase/server";

export async function proxy(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/e/:path*"],
};

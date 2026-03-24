import { redirect } from "next/navigation";
import { MyView } from "@/features";
import { createClient } from "@/lib/supabase/server";

export default async function MyPageRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy로 위치 수정 필요
  if (!user) redirect("/login");

  const isOAuth = user.app_metadata?.provider !== "email";

  return (
    <div className="w-full px-4 sm:px-0 flex flex-col items-center">
      <div className="font-semibold text-lg sm:text-xl mb-6!">개인정보</div>
      <MyView isOAuth={isOAuth} />
    </div>
  );
}

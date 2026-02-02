import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return Response.json(null, { status: 401 });
  return Response.json(data.user);
}

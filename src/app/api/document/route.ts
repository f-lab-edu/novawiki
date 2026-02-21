import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const query = supabase.from("document").select("*");
  // query = query.eq(filter.column, filter.value);

  const { data, error } = await query;
  if (error) return Response.json(null, { status: 401 });
  return Response.json(data);
}

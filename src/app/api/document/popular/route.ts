import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const query = supabase.from('document').select('*').eq('display', true);

  const { data, error } = await query;
  if (error) return Response.json(null, { status: 401 });
  return Response.json(data);
}

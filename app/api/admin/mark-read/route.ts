import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return Response.json({ success: false }, { status: 400 });
  }

  await supabase
    .from("bookings")
    .update({ is_read: true })
    .eq("id", id);

  return Response.json({ success: true });
}
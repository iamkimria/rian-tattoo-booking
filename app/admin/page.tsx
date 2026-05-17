import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import BookingCard from "./BookingCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function deleteBooking(formData: FormData) {
  "use server";

  const id = formData.get("id");

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await adminSupabase.from("bookings").delete().eq("id", id);

  revalidatePath("/admin");
}

async function updateStatus(formData: FormData) {
  "use server";

  const id = formData.get("id");
  const status = formData.get("status");

  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await adminSupabase.from("bookings").update({ status }).eq("id", id);

  revalidatePath("/admin");
}

function parseReferenceUrls(value: string | null) {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default async function AdminPage() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black p-10 text-white font-sans">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="mt-6 text-red-400">Failed to load bookings.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white font-sans md:p-10">
      <h1 className="mb-10 text-4xl font-bold tracking-[0.1em]">
        BOOKINGS
      </h1>

      <div className="space-y-6">
        {bookings?.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            referenceUrls={parseReferenceUrls(booking.reference_image_urls)}
            updateStatus={updateStatus}
            deleteBooking={deleteBooking}
          />
        ))}
      </div>
    </main>
  );
}
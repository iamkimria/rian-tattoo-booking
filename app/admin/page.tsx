import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

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

  await adminSupabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

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
function getStatusStyle(status: string) {
  switch (status) {
    case "NEW":
      return "bg-blue-500/20 text-blue-200 border-blue-400/20";

    case "REPLIED":
      return "bg-yellow-500/20 text-yellow-200 border-yellow-400/20";

    case "WAITING DEPOSIT":
      return "bg-orange-500/20 text-orange-200 border-orange-400/20";

    case "CONFIRMED":
      return "bg-green-500/20 text-green-200 border-green-400/20";

    case "DONE":
      return "bg-purple-500/20 text-purple-200 border-purple-400/20";

    case "CANCELLED":
      return "bg-red-500/20 text-red-200 border-red-400/20";

    default:
      return "bg-white/10 text-white/70 border-white/10";
  }
}

export default async function AdminPage() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="mt-6 text-red-400">Failed to load bookings.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <h1 className="mb-10 text-4xl font-bold tracking-[0.1em]">
        BOOKINGS
      </h1>

      <div className="space-y-6">
        {bookings?.map((booking) => {
          const referenceUrls = parseReferenceUrls(
            booking.reference_image_urls
          );

          return (
            <div
              key={booking.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-bold">
                  {booking.first_name} {booking.last_name}
                </h2>

                <div className="flex items-center gap-3">
                  <div className="flex flex-wrap items-center gap-2">
  {[
    "NEW",
    "REPLIED",
    "WAITING DEPOSIT",
    "CONFIRMED",
    "DONE",
    "CANCELLED",
  ].map((status) => (
    <form key={status} action={updateStatus}>
      <input type="hidden" name="id" value={booking.id} />

      <input type="hidden" name="status" value={status} />

      <button
        type="submit"
        className={`rounded-full border px-3 py-2 text-xs font-bold tracking-[0.08em] transition hover:scale-[1.03] ${getStatusStyle(
          booking.status === status ? status : ""
        )}`}
      >
        {status}
      </button>
    </form>
  ))}
</div>

                  <form action={deleteBooking}>
                    <input type="hidden" name="id" value={booking.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-400/40 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/10"
                    >
                      DELETE
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-6 grid gap-4 text-white/80 md:grid-cols-2">
                <p><b>Email:</b> {booking.email}</p>
                <p><b>Phone:</b> {booking.phone}</p>
                <p><b>City:</b> {booking.current_city}</p>
                <p><b>Size:</b> {booking.expected_size}</p>
              </div>

              <div className="mt-6">
                <p className="mb-2 font-bold">Placement</p>
                <p className="text-white/80">{booking.placement}</p>
              </div>

              <div className="mt-6">
                <p className="mb-2 font-bold">Design Description</p>
                <p className="whitespace-pre-wrap text-white/80">
                  {booking.design_description}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {booking.placement_photo_url && (
                  <a
                    href={booking.placement_photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block underline underline-offset-4"
                  >
                    Open Placement Photo
                  </a>
                )}

                {referenceUrls.length > 0 && (
                  <div>
                    <p className="mb-2 font-bold">Reference Images</p>
                    <div className="space-y-2">
                      {referenceUrls.map((url: string, index: number) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block underline underline-offset-4"
                        >
                          Open Reference Image {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
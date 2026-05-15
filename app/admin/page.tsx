import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminPage() {
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        <h1 className="text-3xl font-bold">Admin</h1>

        <p className="mt-6 text-red-400">
          Failed to load bookings.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="mb-10 text-4xl font-bold tracking-[0.1em]">
        BOOKINGS
      </h1>

      <div className="space-y-6">
        {bookings?.map((booking) => (
          <div
            key={booking.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {booking.first_name} {booking.last_name}
              </h2>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white/70">
                {booking.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 text-white/80 md:grid-cols-2">
              <p>
                <span className="font-bold text-white">Email:</span>{" "}
                {booking.email}
              </p>

              <p>
                <span className="font-bold text-white">Phone:</span>{" "}
                {booking.phone}
              </p>

              <p>
                <span className="font-bold text-white">City:</span>{" "}
                {booking.current_city}
              </p>

              <p>
                <span className="font-bold text-white">Size:</span>{" "}
                {booking.expected_size}
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-2 font-bold text-white">
                Placement
              </p>

              <p className="text-white/80">
                {booking.placement}
              </p>
            </div>

            <div className="mt-6">
              <p className="mb-2 font-bold text-white">
                Design Description
              </p>

              <p className="whitespace-pre-wrap text-white/80">
                {booking.design_description}
              </p>
            </div>

            {booking.placement_photo_url && (
              <div className="mt-6">
                <a
                  href={booking.placement_photo_url}
                  target="_blank"
                  className="underline"
                >
                  Open Placement Photo
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
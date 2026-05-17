"use client";

import { useState } from "react";

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

export default function BookingCard({
  booking,
  referenceUrls,
  updateStatus,
  deleteBooking,
}: {
  booking: any;
  referenceUrls: string[];
  updateStatus: (formData: FormData) => void;
  deleteBooking: (formData: FormData) => void;
}) {
  const [isRead, setIsRead] = useState(Boolean(booking.is_read));

  async function handleToggle(event: React.ToggleEvent<HTMLDetailsElement>) {
    if (event.currentTarget.open && !isRead) {
      setIsRead(true);

      await fetch("/api/admin/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: booking.id }),
      });
    }
  }

  return (
    <details
      onToggle={handleToggle}
      className="group rounded-3xl border border-white/10 bg-white/5 p-5 open:bg-white/[0.07] md:p-6"
    >
      <summary className="cursor-pointer list-none">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {!isRead && (
                <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-bold tracking-[0.12em] text-white">
                  NEW
                </span>
              )}

              <h2 className="text-2xl font-bold">
                {booking.first_name} {booking.last_name}
              </h2>
            </div>

            <p className="mt-2 text-sm text-white/55">
              {booking.current_city} · {booking.expected_size}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border px-3 py-2 text-xs font-bold tracking-[0.08em] ${getStatusStyle(
                booking.status
              )}`}
            >
              {booking.status || "NEW"}
            </span>

            <span className="text-sm font-medium text-white/40 group-open:hidden">
              Tap to open
            </span>

            <span className="hidden text-sm font-medium text-white/40 group-open:inline">
              Tap to close
            </span>
          </div>
        </div>
      </summary>

      <div className="mt-6 border-t border-white/10 pt-6">
        <div className="mb-6 flex flex-wrap gap-2">
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

          <form action={deleteBooking}>
            <input type="hidden" name="id" value={booking.id} />
            <button
              type="submit"
              className="rounded-full border border-red-400/40 px-4 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
            >
              DELETE
            </button>
          </form>
        </div>

        <div className="grid gap-4 text-white/80 md:grid-cols-2">
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
  <div>
    <p className="mb-3 font-bold">Placement Photo</p>

    <a
      href={booking.placement_photo_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src={booking.placement_photo_url}
        alt="Placement"
        className="h-32 w-32 rounded-2xl object-cover transition hover:scale-[1.03]"
      />
    </a>
  </div>
)}

          {referenceUrls.length > 0 && (
  <div>
    <p className="mb-2 font-bold">Reference Images</p>

    <div className="flex flex-wrap gap-3">
      {referenceUrls.map((url: string, index: number) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={url}
            alt={`Reference ${index + 1}`}
            className="h-24 w-24 rounded-2xl object-cover transition hover:scale-[1.03]"
          />
        </a>
      ))}
    </div>
  </div>
)}
        </div>
      </div>
    </details>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  function goToBooking() {
    setLeaving(true);

    setTimeout(() => {
      router.push("/booking");
    }, 600);
  }

  return (
    
    <main
      className={`min-h-screen bg-black text-white transition-all duration-700 ${
        leaving ? "opacity-0 blur-sm" : "opacity-100 blur-0"
      }`}
    >
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black" />

        <div className="relative z-10 max-w-3xl text-center">
          <p className="mb-5 text-base font-semibold tracking-[0.3em] text-white/90">
            WATERCOLOR TATTOO ARTIST
          </p>

          <h1 className="mb-6 text-6xl font-semibold tracking-[0.12em] md:text-8xl">
            RI:AN
          </h1>

          <p className="mb-10 text-xl font-medium leading-relaxed text-white/90 md:text-2xl">
            Delicate watercolor tattoos inspired by emotion, movement, and
            flowing color.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={goToBooking}
              className="w-full rounded-full bg-white px-8 py-4 text-center text-base font-bold tracking-[0.12em] text-black transition duration-300 hover:scale-[1.02] hover:bg-white/80"
            >
              BOOK NOW
            </button>

            <a
              href="https://www.instagram.com/tattooist_rian"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-white/60 px-8 py-4 text-center text-base font-bold tracking-[0.12em] text-white transition duration-300 hover:scale-[1.02] hover:border-white hover:bg-white/10"
            >
              VIEW ON INSTAGRAM
            </a>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10 px-6 py-8 text-center">
  <div className="flex flex-col items-center gap-3 text-sm text-white/40">
  <div className="flex items-center justify-center gap-3">
    <a
      href="/privacy"
      className="transition hover:text-white"
    >
      Privacy Policy
    </a>

    <span>·</span>

    <a
      href="/faq"
      className="transition hover:text-white"
    >
      FAQ
    </a>

    <span>·</span>

    <a
      href="/aftercare"
      className="transition hover:text-white"
    >
      Aftercare
    </a>
  </div>

  <p>© 2026 RI:AN. All rights reserved.</p>
</div>
</footer>
    </main>
  );
}
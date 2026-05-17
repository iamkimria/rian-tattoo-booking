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

          <p className="mb-10 text-lg font-medium leading-relaxed text-white/70 md:text-xl">
            Inspired by movement, emotion, and flowing color.
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
  href="https://instagram.com/tattooist_rian"
  target="_blank"
  rel="noopener noreferrer"
  className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium tracking-[0.08em] text-white/80 transition hover:border-white/40 hover:text-white"
>
  View on Instagram
</a>
          </div>
        </div>
      </section>
            

      <section className="overflow-x-auto border-t border-white/10 bg-black py-10">
        <div className="flex w-max gap-4 px-6">
          {[
            "/works/1.jpg",
            "/works/2.jpg",
            "/works/3.jpg",
            "/works/4.jpg",
            "/works/5.jpg",
            "/works/6.jpg",
            "/works/7.jpg",
            "/works/8.jpg",
            "/works/9.jpg",
            "/works/10.jpg",
          ].map((src, index) => (
            <a
              key={index}
              href="https://instagram.com/tattooist_rian"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl"
            >
              <img
                src={src}
                alt={`RI:AN tattoo work ${index + 1}`}
className="h-[320px] w-[240px] object-cover grayscale-[40%] brightness-90 transition duration-500 ease-out group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:brightness-100"              />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                <span className="rounded-full border border-white/30 bg-black/30 px-5 py-2 text-sm tracking-[0.12em] text-white backdrop-blur-sm">
                  VIEW
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center">
  <div className="flex flex-col items-center gap-3 text-sm text-white/50">
  <div className="flex items-center justify-center gap-3">
    <a
      href="/privacy"
      className="text-white/70 transition hover:text-white"
    >
      Privacy Policy
    </a>

    <span>·</span>

    <a
      href="/faq"
      className="text-white/70 transition hover:text-white"
    >
      FAQ
    </a>

    <span>·</span>

    <a
      href="/aftercare"
      className="text-white/70 transition hover:text-white"
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
export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-10 text-4xl font-bold tracking-[0.08em]">
          FAQ
        </h1>

        <div className="space-y-10 text-white/75">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-white">
              Deposit
            </h2>

            <p className="leading-relaxed">
              A deposit is required to secure your appointment.
              The deposit is included in the final tattoo price
              and is non-refundable.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-white">
              Design Process
            </h2>

            <p className="leading-relaxed">
              Most designs are custom-made for each client.
              Final designs are usually shared a few days before
              the appointment.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-white">
              Revisions
            </h2>

            <p className="leading-relaxed">
              Minor revisions are always possible.
              However, completely changing the concept after the
              design process has started may require additional
              time or cost.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-white">
              Watercolor Tattoos
            </h2>

            <p className="leading-relaxed">
              Watercolor tattoos often require more layering,
              detail, and session time compared to simpler styles.
              Placement, skin tone, and design size may affect
              the final result and longevity.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-xl font-semibold text-white">
              Language
            </h2>

            <p className="leading-relaxed">
              I mainly communicate in English and Korean.
              During guest work, studio staff may also help with
              communication if needed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
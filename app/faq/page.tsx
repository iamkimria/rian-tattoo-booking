export default function FAQPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-editorial mb-14 text-6xl font-semibold tracking-[0.04em]">
          FAQ
        </h1>

        <div className="space-y-14 text-lg text-white/85">
          <div>
            <h2 className="font-editorial mb-4 text-3xl font-semibold text-white">
              Deposit
            </h2>

            <p className="leading-8">
              A deposit is required to secure your appointment.
              The deposit is included in the final tattoo price
              and is non-refundable.
            </p>
          </div>

          <div>
           <h2 className="font-editorial mb-4 text-3xl font-semibold text-white">
              Design Process
            </h2>

            <p className="leading-8">
              Most designs are custom-made for each client.
              Final designs are usually shared a few days before
              the appointment.
            </p>
          </div>

          <div>
            <h2 className="font-editorial mb-4 text-3xl font-semibold text-white">
              Revisions
            </h2>

            <p className="leading-8">
              Minor revisions are always possible.
              However, completely changing the concept after the
              design process has started may require additional
              time or cost.
            </p>
          </div>

          <div>
            <h2 className="font-editorial mb-4 text-3xl font-semibold text-white">
              Watercolor Tattoos
            </h2>

            <p className="leading-8">
              Watercolor tattoos often require more layering,
              detail, and session time compared to simpler styles.
              Placement, skin tone, and design size may affect
              the final result and longevity.
            </p>
          </div>

          <div>
            <h2 className="font-editorial mb-4 text-3xl font-semibold text-white">
              Language
            </h2>

            <p className="leading-8">
              I mainly communicate in English and Korean.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
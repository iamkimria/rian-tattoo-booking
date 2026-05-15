"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "./api/uploadthing/core";

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-lg font-medium text-white outline-none transition placeholder:text-white/55 focus:border-white/50";

const smallInputClass =
  "w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-base font-medium text-white outline-none transition placeholder:text-white/55 focus:border-white/50";

const labelClass =
  "mb-3 block text-base font-bold tracking-[0.08em] text-white/90";

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  placeholder,
  rows = 3,
}: {
  label: string;
  name: string;
  placeholder: string;
  rows?: number;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function DateOfBirthField() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 90 }, (_, index) => currentYear - index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <div>
      <label className={labelClass}>DATE OF BIRTH *</label>

      <div className="grid grid-cols-3 gap-3">
        <select name="birthDay" className={inputClass} defaultValue="">
          <option value="" disabled>
            DD
          </option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select name="birthMonth" className={inputClass} defaultValue="">
          <option value="" disabled>
            MM
          </option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select name="birthYear" className={inputClass} defaultValue="">
          <option value="" disabled>
            YYYY
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PreferredSlot({
  number,
  dateName,
  timeName,
  ampmName,
  selectedDate,
  onDateChange,
}: {
  number: string;
  dateName: string;
  timeName: string;
  ampmName: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
      <p className="mb-4 text-base font-bold tracking-[0.08em] text-white/80">
        {number} PREFERRED SLOT
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/YYYY"
            minDate={new Date()}
            className={smallInputClass}
          />

          <input
            type="hidden"
            name={dateName}
            value={selectedDate ? selectedDate.toLocaleDateString("en-GB") : ""}
          />
        </div>

        <input
          name={timeName}
          type="text"
          placeholder="00:00"
          className={smallInputClass}
        />

        <select name={ampmName} className={smallInputClass} defaultValue="">
          <option value="" disabled>
            AM / PM
          </option>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
function getUploadUrl(file: any) {
  return (
    file?.ufsUrl ||
    file?.url ||
    file?.appUrl ||
    file?.serverData?.uploadedFileUrl ||
    ""
  );
}
function UploadedList({
  title,
  urls,
  onRemove,
}: {
  title: string;
  urls: string[];
  onRemove: (index: number) => void;
}) {
  if (urls.length === 0) return null;

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
      <p className="mb-3 text-sm font-bold tracking-[0.08em] text-white/70">
        {title}
      </p>

      <ul className="space-y-3 text-sm text-white/80">
        {urls.map((url, index) => (
          <li
            key={`${url}-${index}`}
            className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3"
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate underline underline-offset-4"
            >
              Uploaded file {index + 1}
            </a>

            <button
              type="button"
              onClick={() => onRemove(index)}
              className="shrink-0 rounded-full border border-white/20 px-3 py-1 text-xs font-bold text-white/80 transition hover:bg-white/10"
            >
              REMOVE
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(null);
  const [thirdDate, setThirdDate] = useState<Date | null>(null);

  const [placementPhotoUrl, setPlacementPhotoUrl] = useState("");
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/booking", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (response.ok) {
      setSuccess(true);
      form.reset();
      setFirstDate(null);
      setSecondDate(null);
      setThirdDate(null);
      setPlacementPhotoUrl("");
      setReferenceImageUrls([]);
    } else {
      setError(true);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
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
            <a
              href="#booking"
              className="w-full rounded-full bg-white px-8 py-4 text-center text-base font-bold tracking-[0.12em] text-black transition hover:bg-white/80 sm:w-auto"
            >
              BOOK NOW
            </a>

            <a
              href="https://www.instagram.com/tattooist_rian"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-white/60 px-8 py-4 text-center text-base font-bold tracking-[0.12em] text-white transition hover:border-white hover:bg-white/10 sm:w-auto"
            >
              VIEW ON INSTAGRAM
            </a>
          </div>
        </div>
      </section>

      <section id="booking" className="bg-zinc-950 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-base font-semibold tracking-[0.25em] text-white/80">
              BOOKING REQUEST
            </p>

            <h2 className="mb-6 text-4xl font-semibold tracking-[0.08em] md:text-5xl">
              BOOKING FORM
            </h2>

            <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-white/85">
              Please fill out this form carefully. I’ll get back to you as soon
              as possible.
            </p>

            <div className="mt-8 text-center">
              <p className="mb-4 text-base font-bold tracking-[0.12em] text-white/75">
                GUEST SPOTS
              </p>
              <p className="text-lg font-medium text-white/85">
                🇩🇪 Deutschland · June - July
              </p>
              <p className="mt-2 text-lg font-medium text-white/85">
                🇳🇱 Amsterdam · July
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid gap-7 md:grid-cols-2">
              <Field
                label="FIRST NAME *"
                name="firstName"
                placeholder="First name"
              />

              <Field
                label="LAST NAME *"
                name="lastName"
                placeholder="Last name"
              />

              <DateOfBirthField />

              <Field
                label="PHONE NUMBER *"
                name="phone"
                placeholder="+49 / +31 / +82 ..."
              />

              <Field
                label="E-MAIL *"
                name="email"
                type="email"
                placeholder="your@email.com"
              />

              <Field
                label="INSTAGRAM"
                name="instagram"
                placeholder="@username"
              />

              <Field
                label="CURRENT CITY *"
                name="currentCity"
                placeholder="Berlin, Amsterdam, Seoul..."
              />
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <label className={labelClass}>PREFERRED DATE & TIME *</label>

              <p className="mb-5 text-base font-medium text-white/60">
                Please select up to 3 preferred dates and times.
              </p>

              <div className="space-y-4">
                <PreferredSlot
                  number="1ST"
                  dateName="firstDate"
                  timeName="firstTime"
                  ampmName="firstAmPm"
                  selectedDate={firstDate}
                  onDateChange={setFirstDate}
                />

                <PreferredSlot
                  number="2ND"
                  dateName="secondDate"
                  timeName="secondTime"
                  ampmName="secondAmPm"
                  selectedDate={secondDate}
                  onDateChange={setSecondDate}
                />

                <PreferredSlot
                  number="3RD"
                  dateName="thirdDate"
                  timeName="thirdTime"
                  ampmName="thirdAmPm"
                  selectedDate={thirdDate}
                  onDateChange={setThirdDate}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <TextArea
                label="WHERE WOULD YOU LIKE TO GET TATTOOED? *"
                name="placement"
                placeholder="Example: inner forearm, upper arm, ankle..."
              />

              <div className="mt-7">
                <label className={labelClass}>PHOTO OF THE TATTOO AREA *</label>

                <UploadButton<OurFileRouter, "imageUploader">
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {

  const file = res?.[0] as any;

  const uploadedUrl =

    file?.ufsUrl ||

    file?.url ||

    file?.serverData?.uploadedFileUrl;

  if (uploadedUrl) {

    setPlacementPhotoUrl(uploadedUrl);

  }
                  }}
                  onUploadError={(uploadError: Error) => {
                    alert(`Upload failed: ${uploadError.message}`);
                  }}
                  appearance={{
  button:
  "!max-w-full !whitespace-normal !break-words !text-center !text-black !bg-white font-bold px-5 py-3 rounded-full",
                    container:
  "w-full max-w-full overflow-hidden rounded-2xl border border-dashed border-white/30 bg-black/30 px-4 py-6 text-center md:px-6 md:py-10",
                    allowedContent: "text-white/60",
                  }}
                />

                <UploadedList
                  title="UPLOADED PLACEMENT PHOTO"
                  urls={placementPhotoUrl ? [placementPhotoUrl] : []}
                  onRemove={() => setPlacementPhotoUrl("")}
                />

                <input
                  type="hidden"
                  name="placementPhotoUrl"
                  value={placementPhotoUrl}
                />
              </div>
            </div>

            <Field
              label="EXPECTED SIZE *"
              name="expectedSize"
              placeholder="Example: 10cm, 15cm, palm size..."
            />

            <TextArea
              label="DESIGN DESCRIPTION *"
              name="designDescription"
              rows={5}
              placeholder="Please describe your tattoo idea, meaning, style, colors, and any important details."
            />

            <div>
              <label className={labelClass}>DESIGN REFERENCES *</label>

              <UploadButton<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                 const urls =

  res?.map((file) => {

    const uploadedFile = file as any;

    return (

      uploadedFile?.ufsUrl ||

      uploadedFile?.url ||

      uploadedFile?.serverData?.uploadedFileUrl

    );

  }).filter(Boolean) || [];
                  setReferenceImageUrls((prev) => [...prev, ...urls]);
                }}
                onUploadError={(uploadError: Error) => {
                  alert(`Upload failed: ${uploadError.message}`);
                }}
                appearance={{
  button:
  "!max-w-full !whitespace-normal !break-words !text-center !text-black !bg-white font-bold px-5 py-3 rounded-full",
                  container:
  "w-full max-w-full overflow-hidden rounded-2xl border border-dashed border-white/30 bg-black/30 px-4 py-6 text-center md:px-6 md:py-10",
                  allowedContent: "text-white/60",
                }}
              />

              <UploadedList
                title="UPLOADED REFERENCES"
                urls={referenceImageUrls}
                onRemove={(index) => {
                  setReferenceImageUrls((prev) =>
                    prev.filter((_, itemIndex) => itemIndex !== index)
                  );
                }}
              />

              <input
                type="hidden"
                name="referenceImageUrls"
                value={JSON.stringify(referenceImageUrls)}
              />
            </div>

            <label className="flex gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 text-lg font-medium leading-relaxed text-white/85">
              <input
                name="legalAge"
                value="yes"
                type="checkbox"
                className="mt-2"
              />

              <span>
                I confirm that I am an adult of legal age, 19+ based on
                international age.
              </span>
            </label>

            <p className="text-center text-base font-medium text-white/60">
              Your booking is not confirmed until the deposit is received.
            </p>

            {success && (
              <p className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center text-lg font-semibold text-white">
                Thank you. Your booking request has been sent successfully.
              </p>
            )}

            {error && (
              <p className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-center text-lg font-semibold text-red-200">
                Something went wrong. Please try again or contact me on
                Instagram.
              </p>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-white px-10 py-4 text-base font-bold tracking-[0.12em] text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "SENDING..." : "SEND BOOKING REQUEST"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
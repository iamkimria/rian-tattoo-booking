"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../api/uploadthing/core";

const inputClass =
  "w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-lg font-medium text-white outline-none transition placeholder:text-white/55 focus:border-white/50";

const smallInputClass =
  "w-full rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-base font-medium text-white outline-none transition placeholder:text-white/55 focus:border-white/50";

const labelClass =
  "mb-3 block text-base font-bold tracking-[0.08em] text-white/90";

function getUploadUrl(file: any) {
  return (
    file?.ufsUrl ||
    file?.url ||
    file?.appUrl ||
    file?.serverData?.uploadedFileUrl ||
    ""
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        required={required}
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
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <textarea
        required={required}
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
        <select required name="birthDay" className={inputClass} defaultValue="">
          <option value="" disabled>
            DD
          </option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select required name="birthMonth" className={inputClass} defaultValue="">
          <option value="" disabled>
            MM
          </option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <select required name="birthYear" className={inputClass} defaultValue="">
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
  required = false,
}: {
  number: string;
  dateName: string;
  timeName: string;
  ampmName: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  required?: boolean;
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
          required={required}
          name={timeName}
          type="text"
          placeholder="00:00"
          className={smallInputClass}
        />

        <select
          required={required}
          name={ampmName}
          className={smallInputClass}
          defaultValue=""
        >
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

function UploadArea({
  label,
  helperText,
  onUpload,
}: {
  label: string;
  helperText?: string;
  onUpload: (urls: string[]) => void;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>

      {helperText && (
        <p className="mb-3 text-sm font-medium leading-relaxed text-white/55">
          {helperText}
        </p>
      )}

      <div className="rounded-2xl border border-dashed border-white/30 bg-black/30 px-4 py-8 text-center transition hover:border-white/60 hover:bg-white/10">
        <UploadButton<OurFileRouter, "imageUploader">
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const urls =
              res?.map((file) => getUploadUrl(file)).filter(Boolean) || [];

            if (urls.length > 0) {
              onUpload(urls);
            }
          }}
          onUploadError={(uploadError: Error) => {
            alert(`Upload failed: ${uploadError.message}`);
          }}
          appearance={{
            container: "!w-full !max-w-full !border-0 !bg-transparent !p-0",
            button:
              "!w-full !max-w-full !bg-transparent !px-3 !py-2 !text-center !text-base !font-semibold !text-white !shadow-none hover:!bg-transparent",
            allowedContent: "!mt-3 !text-sm !text-white/55",
          }}
          content={{
            button({ isUploading }) {
              return isUploading ? "Uploading..." : "☁️ Tap to upload images";
            },
            allowedContent() {
              return "Images up to 8MB";
            },
          }}
        />
      </div>
    </div>
  );
}

export default function BookingPage() {
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

    setLoading(false);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const requiredFields = [
      "firstName",
      "lastName",
      "birthDay",
      "birthMonth",
      "birthYear",
      "phone",
      "email",
      "currentCity",
      "firstDate",
      "firstTime",
      "firstAmPm",
      "placement",
      "expectedSize",
      "designDescription",
      "legalAge",
    ];

    for (const field of requiredFields) {
      const value = formData.get(field);

      if (!value) {
        alert("Please fill out all required fields before submitting.");
        return;
      }
    }

    if (!placementPhotoUrl) {
      alert("Please upload a photo of the tattoo area.");
      return;
    }

    if (referenceImageUrls.length === 0) {
      alert("Please upload at least one design reference image.");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError(false);

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
      <section id="booking" className="bg-zinc-950 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-base font-semibold tracking-[0.25em] text-white/80">
              BOOKING REQUEST
            </p>

            <h1 className="mb-6 text-4xl font-semibold tracking-[0.08em] md:text-5xl">
              BOOKING FORM
            </h1>

            <p className="mx-auto max-w-2xl text-xl font-medium leading-relaxed text-white/85">
              Please fill out this form carefully. I’ll get back to you as soon
              as possible.
            </p>
            <div className="mx-auto mt-10 h-px w-full max-w-3xl bg-white/10" />

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
<div className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
  <p className="text-base font-medium leading-relaxed text-white/70">
    Each tattoo is custom designed for every client.
    <br />
    Please describe your idea as carefully as possible.
  </p>
</div>
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid gap-7 md:grid-cols-2">
              <Field required label="FIRST NAME *" name="firstName" placeholder="First name" />
              <Field required label="LAST NAME *" name="lastName" placeholder="Last name" />

              <DateOfBirthField />

              <Field required label="PHONE NUMBER *" name="phone" placeholder="+49 / +31 / +82 ..." />
              <Field required label="E-MAIL *" name="email" type="email" placeholder="your@email.com" />
              <Field label="INSTAGRAM" name="instagram" placeholder="@username" />
              <Field required label="CURRENT CITY *" name="currentCity" placeholder="Berlin, Amsterdam, Seoul..." />
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
              <label className={labelClass}>PREFERRED DATE & TIME *</label>

              <p className="mb-5 text-base font-medium text-white/60">
                Please select up to 3 preferred dates and times.
              </p>

              <div className="space-y-4">
                <PreferredSlot
                  required
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
                required
                label="WHERE WOULD YOU LIKE TO GET TATTOOED? *"
                name="placement"
                placeholder="Example: inner forearm, upper arm, ankle..."
              />

              <div className="mt-7">
                <UploadArea
                  label="PHOTO OF THE TATTOO AREA *"
                  helperText="Images up to 8MB. If your photo is too large, taking a screenshot of it usually makes it easier to upload."
                  onUpload={(urls) => {
                    setPlacementPhotoUrl(urls[0]);
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
              required
              label="EXPECTED SIZE *"
              name="expectedSize"
              placeholder="Example: 10cm, 15cm, palm size..."
            />

            <TextArea
              required
              label="DESIGN DESCRIPTION *"
              name="designDescription"
              rows={5}
              placeholder="Please describe your tattoo idea, meaning, style, colors, and any important details."
            />

            <div>
              <UploadArea
                label="DESIGN REFERENCES *"
                helperText="Reference images, inspiration photos, existing tattoos, color palettes, or visual ideas are all welcome. Images up to 8MB each."
                onUpload={(urls) => {
                  setReferenceImageUrls((prev) => [...prev, ...urls]);
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
                required
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
                Something went wrong. Please try again or contact me on Instagram.
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
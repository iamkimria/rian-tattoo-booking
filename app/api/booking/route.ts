import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "RI:AN Booking <booking@riantattoo.com>";
const OWNER_EMAIL = "iamkimria@gmail.com";

function safeText(value: FormDataEntryValue | null) {
  return value ? String(value) : "";
}

function formatLinks(urls: string[]) {
  if (!urls.length) return "<p>No reference images uploaded.</p>";

  return `
    <ul>
      ${urls
        .map(
          (url, index) => `
            <li>
              <a href="${url}" target="_blank">
                Reference Image ${index + 1}
              </a>
              <br />
              ${url}
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = safeText(formData.get("firstName"));
    const lastName = safeText(formData.get("lastName"));

    const birthDay = safeText(formData.get("birthDay"));
    const birthMonth = safeText(formData.get("birthMonth"));
    const birthYear = safeText(formData.get("birthYear"));

    const phone = safeText(formData.get("phone"));
    const email = safeText(formData.get("email"));
    const instagram = safeText(formData.get("instagram"));
    const currentCity = safeText(formData.get("currentCity"));

    const firstDate = safeText(formData.get("firstDate"));
    const firstTime = safeText(formData.get("firstTime"));
    const firstAmPm = safeText(formData.get("firstAmPm"));

    const secondDate = safeText(formData.get("secondDate"));
    const secondTime = safeText(formData.get("secondTime"));
    const secondAmPm = safeText(formData.get("secondAmPm"));

    const thirdDate = safeText(formData.get("thirdDate"));
    const thirdTime = safeText(formData.get("thirdTime"));
    const thirdAmPm = safeText(formData.get("thirdAmPm"));

    const placement = safeText(formData.get("placement"));
    const expectedSize = safeText(formData.get("expectedSize"));
    const designDescription = safeText(formData.get("designDescription"));

    const placementPhotoUrl = safeText(
      formData.get("placementPhotoUrl")
    );

    const referenceImageUrlsRaw = safeText(
      formData.get("referenceImageUrls")
    );

    let referenceImageUrls: string[] = [];

    try {
      const parsed = JSON.parse(referenceImageUrlsRaw || "[]");

      if (Array.isArray(parsed)) {
        referenceImageUrls = parsed.filter(
          (url) => typeof url === "string"
        );
      }
    } catch {
      referenceImageUrls = [];
    }

    const legalAge = safeText(formData.get("legalAge"));

    // SUPABASE SAVE
const { data, error } = await supabase
  .from("bookings")
  .insert({
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    current_city: currentCity,

    first_date: firstDate,
    first_time: firstTime,
    first_ampm: firstAmPm,

    second_date: secondDate,
    second_time: secondTime,
    second_ampm: secondAmPm,

    third_date: thirdDate,
    third_time: thirdTime,
    third_ampm: thirdAmPm,

    placement,
    expected_size: expectedSize,
    design_description: designDescription,
    placement_photo_url: placementPhotoUrl,
    reference_image_urls: JSON.stringify(referenceImageUrls),
    status: "new",
  });

console.log(data);
console.log(error);

    // OWNER EMAIL
    await resend.emails.send({
      from: FROM_EMAIL,
      to: OWNER_EMAIL,
      subject: `New tattoo booking request from ${firstName} ${lastName}`,
      html: `
        <h1>New Tattoo Booking Request</h1>

        <h2>Client Info</h2>

        <p><b>Name:</b> ${firstName} ${lastName}</p>

        <p>
          <b>Date of Birth:</b>
          ${birthDay}/${birthMonth}/${birthYear}
        </p>

        <p><b>Phone:</b> ${phone}</p>

        <p><b>Email:</b> ${email}</p>

        <p><b>Instagram:</b> ${instagram}</p>

        <p><b>Current City:</b> ${currentCity}</p>

        <h2>Preferred Date & Time</h2>

        <p>
          <b>1st:</b>
          ${firstDate} ${firstTime} ${firstAmPm}
        </p>

        <p>
          <b>2nd:</b>
          ${secondDate} ${secondTime} ${secondAmPm}
        </p>

        <p>
          <b>3rd:</b>
          ${thirdDate} ${thirdTime} ${thirdAmPm}
        </p>

        <h2>Tattoo Details</h2>

        <p><b>Placement:</b> ${placement}</p>

        <p><b>Expected Size:</b> ${expectedSize}</p>

        <p><b>Design Description:</b></p>

        <p>${designDescription}</p>

        <h2>Uploaded Images</h2>

        <p><b>Placement Photo:</b></p>

        ${
          placementPhotoUrl
            ? `
              <p>
                <a href="${placementPhotoUrl}" target="_blank">
                  Open Placement Photo
                </a>

                <br />

                ${placementPhotoUrl}
              </p>
            `
            : "<p>No placement photo uploaded.</p>"
        }

        <p><b>Reference Images:</b></p>

        ${formatLinks(referenceImageUrls)}

        <h2>Confirmation</h2>

        <p>
          <b>Legal Age Confirmed:</b>
          ${legalAge ? "Yes" : "No"}
        </p>
      `,
    });

    // CLIENT EMAIL
    if (email) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject:
          "Your RI:AN tattoo booking request has been received",
        html: `
          <h1>Thank you for your booking request.</h1>

          <p>Hi ${firstName},</p>

          <p>
            Thank you for your interest in my work.
            I have received your tattoo booking request and will review your idea carefully.
          </p>

          <p>
            Please note that your booking is not confirmed until the deposit is received.
          </p>

          <p>
            I’ll get back to you as soon as possible with more details.
          </p>

          <p>
            Warmly,<br />
            RI:AN
          </p>
        `,
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to send booking request.",
      },
      { status: 500 }
    );
  }
}
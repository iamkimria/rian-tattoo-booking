import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function fileToBase64(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return buffer.toString("base64");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const dateOfBirth = formData.get("dateOfBirth");
    const phone = formData.get("phone");
    const email = formData.get("email");
    const instagram = formData.get("instagram");
    const currentCity = formData.get("currentCity");

    const firstDate = formData.get("firstDate");
    const firstTime = formData.get("firstTime");
    const firstAmPm = formData.get("firstAmPm");

    const secondDate = formData.get("secondDate");
    const secondTime = formData.get("secondTime");
    const secondAmPm = formData.get("secondAmPm");

    const thirdDate = formData.get("thirdDate");
    const thirdTime = formData.get("thirdTime");
    const thirdAmPm = formData.get("thirdAmPm");

    const placement = formData.get("placement");
    const expectedSize = formData.get("expectedSize");
    const designDescription = formData.get("designDescription");
    const legalAge = formData.get("legalAge");

    const placementPhoto = formData.get("placementPhoto") as File | null;
    const referenceImages = formData.getAll("referenceImages") as File[];

    const attachments = [];

    if (placementPhoto && placementPhoto.size > 0) {
      attachments.push({
        filename: `PLACEMENT_${placementPhoto.name}`,
        content: await fileToBase64(placementPhoto),
      });
    }

    for (const image of referenceImages) {
      if (image && image.size > 0) {
        attachments.push({
          filename: `REFERENCE_${image.name}`,
          content: await fileToBase64(image),
        });
      }
    }

    const result = await resend.emails.send({
      from: "RI:AN Booking <onboarding@resend.dev>",
      to: "iamkimria@gmail.com",
      subject: `New tattoo booking request from ${firstName} ${lastName}`,
      html: `
        <h1>New Tattoo Booking Request</h1>

        <h2>Client Info</h2>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Date of Birth:</b> ${dateOfBirth}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Instagram:</b> ${instagram}</p>
        <p><b>Current City:</b> ${currentCity}</p>

        <h2>Preferred Date & Time</h2>
        <p><b>1st:</b> ${firstDate} ${firstTime} ${firstAmPm}</p>
        <p><b>2nd:</b> ${secondDate} ${secondTime} ${secondAmPm}</p>
        <p><b>3rd:</b> ${thirdDate} ${thirdTime} ${thirdAmPm}</p>

        <h2>Tattoo Details</h2>
        <p><b>Placement:</b> ${placement}</p>
        <p><b>Expected Size:</b> ${expectedSize}</p>
        <p><b>Design Description:</b></p>
        <p>${designDescription}</p>

        <h2>Confirmation</h2>
        <p><b>Legal Age Confirmed:</b> ${legalAge ? "Yes" : "No"}</p>
      `,
      attachments,
    });

    console.log("RESEND RESULT:", result);

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Failed to send booking request." },
      { status: 500 }
    );
  }
}
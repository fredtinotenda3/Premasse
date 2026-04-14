// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { resend, EMAIL_FROM, EMAIL_ADMIN } from "@/lib/resend";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const body   = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid form data." }, { status: 422 });
  }

  const { name, email, phone, subject, message } = parsed.data;

  await resend.emails.send({
    from:    EMAIL_FROM,
    to:      [EMAIL_ADMIN],
    replyTo: email,
    subject: `Contact form: ${subject}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})${phone ? ` · ${phone}` : ""}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr/>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  return NextResponse.json({ success: true });
}
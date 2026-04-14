// app/api/portal/register/route.ts
// Creates a new CLIENT account.
// After creating the account, links any existing anonymous requests
// that share the same email address.

import { NextRequest, NextResponse } from "next/server";
import { z }      from "zod";
import { prisma } from "@/lib/prisma";
import { hash }   from "bcryptjs";

const registerSchema = z.object({
  name:  z.string().min(2).max(100).trim(),
  email: z.string().email().trim().toLowerCase(),
  phone: z
    .string()
    .regex(/^(\+263|0)[0-9]{9}$/, "Enter a valid Zimbabwean number")
    .optional()
    .or(z.literal("")),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); }
  catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { name, email, phone } = parsed.data;

  // Check for existing account
  const existing = await prisma.user.findUnique({
    where:  { email },
    select: { id: true, role: true },
  });

  if (existing) {
    // If account exists but is CLIENT, tell them to log in
    if (existing.role === "CLIENT") {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }
    // Admin email — don't reveal this
    return NextResponse.json(
      { success: false, error: "Unable to create account with this email." },
      { status: 409 }
    );
  }

  // Create the CLIENT user + link anonymous requests in a transaction
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        role:  "CLIENT",
      },
      select: { id: true, email: true },
    });

    // Link any anonymous requests with this email to the new account
    const linked = await tx.serviceRequest.updateMany({
      where: { clientEmail: email, userId: null },
      data:  { userId: newUser.id },
    });

    if (linked.count > 0) {
      console.info(
        `[portal/register] Linked ${linked.count} existing request(s) to new account: ${email}`
      );
    }

    return newUser;
  });

  console.info(`[portal/register] New client account created: ${user.email}`);

  return NextResponse.json(
    { success: true, message: "Account created. You can now sign in." },
    { status: 201 }
  );
}
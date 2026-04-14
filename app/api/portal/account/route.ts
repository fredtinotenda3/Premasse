// app/api/portal/account/route.ts
// PATCH — updates the authenticated client's name and phone.
// Only the account owner can update their own details.

import { NextRequest, NextResponse } from "next/server";
import { z }      from "zod";
import { auth }   from "@/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name:  z.string().min(2).max(100).trim(),
  phone: z
    .string()
    .regex(/^(\+263|0)[0-9]{9}$/)
    .optional()
    .or(z.literal("")),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") {
    return NextResponse.json({ success: false, error: "Unauthorised." }, { status: 401 });
  }

  let body: unknown;
  try { body = await req.json(); }
  catch {
    return NextResponse.json({ success: false, error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data:  {
      name:  parsed.data.name,
      phone: parsed.data.phone || null,
    },
  });

  console.info(`[portal/account] Updated profile for user ${session.user.id}`);

  return NextResponse.json({ success: true });
}
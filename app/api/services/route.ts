// app/api/services/route.ts
// GET — returns all active services ordered by sortOrder.
// Used by the public request form to populate the service dropdown.

import { NextResponse } from "next/server";
import { prisma }       from "@/lib/prisma";

export const revalidate = 60;

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where:   { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id:          true,
        name:        true,
        slug:        true,
        category:    true,
        description: true,
        price:       true,
      },
    });

    return NextResponse.json({ success: true, services });
  } catch (err) {
    console.error("[api/services] Failed to fetch services:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load services." },
      { status: 500 }
    );
  }
}
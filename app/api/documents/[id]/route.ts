// app/api/documents/[id]/route.ts
// DELETE /api/documents/:id
// Removes a document from both Cloudinary and the database.
// Admin-only in Phase 3 — Phase 4 can extend to allow client self-removal.

import { NextRequest, NextResponse } from "next/server";
import { auth }                   from "@/auth";
import { prisma }                 from "@/lib/prisma";
import { deleteFromCloudinary }   from "@/lib/cloudinary";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Admin auth guard
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Unauthorised." },
      { status: 401 }
    );
  }

  const { id } = await params;

  // 2. Find the document
  const document = await prisma.document.findUnique({
    where:  { id },
    select: { id: true, publicId: true, fileName: true, requestId: true },
  });

  if (!document) {
    return NextResponse.json(
      { success: false, error: "Document not found." },
      { status: 404 }
    );
  }

  // 3. Delete from Cloudinary first
  // If this fails, we don't delete the DB record — keeps them in sync.
  try {
    await deleteFromCloudinary(document.publicId);
  } catch (err) {
    console.error(
      `[api/documents] Cloudinary delete failed for publicId=${document.publicId}:`,
      err
    );
    return NextResponse.json(
      { success: false, error: "Failed to delete file from storage." },
      { status: 500 }
    );
  }

  // 4. Delete from DB
  await prisma.document.delete({ where: { id } });

  console.info(
    `[api/documents] Deleted document ${id} (${document.fileName}) from request ${document.requestId} by admin ${session.user.email}`
  );

  return NextResponse.json({ success: true });
}
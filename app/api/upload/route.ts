// app/api/upload/route.ts
// Handles multipart file uploads for service request documents.
// Validates file type + size, uploads to Cloudinary, saves metadata to DB.
// Does NOT require auth in Phase 3 — any submitter can upload to their request.
// In Phase 4, lock this down to authenticated clients only.

import { NextRequest, NextResponse } from "next/server";
import { prisma }               from "@/lib/prisma";
import { uploadToCloudinary }   from "@/lib/cloudinary";

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/msword",                                                    // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
]);

const ALLOWED_EXTENSIONS = new Set([
  ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx",
]);

// ── POST /api/upload ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid form data." },
      { status: 400 }
    );
  }

  const file      = formData.get("file")      as File | null;
  const requestId = formData.get("requestId") as string | null;

  // 2. Validate inputs
  if (!file || !requestId) {
    return NextResponse.json(
      { success: false, error: "Both file and requestId are required." },
      { status: 400 }
    );
  }

  // 3. Validate request exists
  const serviceRequest = await prisma.serviceRequest.findUnique({
    where:  { id: requestId },
    select: { id: true, status: true },
  });

  if (!serviceRequest) {
    return NextResponse.json(
      { success: false, error: "Service request not found." },
      { status: 404 }
    );
  }

  // Prevent uploads to completed/cancelled requests
  if (["COMPLETED", "CANCELLED"].includes(serviceRequest.status)) {
    return NextResponse.json(
      { success: false, error: "Cannot upload documents to a closed request." },
      { status: 409 }
    );
  }

  // 4. Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: `File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`,
      },
      { status: 413 }
    );
  }

  // 5. Validate file type (MIME + extension double-check)
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(file.type) || !ALLOWED_EXTENSIONS.has(ext)) {
    return NextResponse.json(
      {
        success: false,
        error: "File type not allowed. Accepted: PDF, JPG, PNG, DOC, DOCX.",
      },
      { status: 415 }
    );
  }

  // 6. Cap documents per request at 10
  const existingCount = await prisma.document.count({
    where: { requestId },
  });

  if (existingCount >= 10) {
    return NextResponse.json(
      { success: false, error: "Maximum of 10 documents per request." },
      { status: 409 }
    );
  }

  // 7. Convert File to Buffer for Cloudinary
  const arrayBuffer = await file.arrayBuffer();
  const buffer      = Buffer.from(arrayBuffer);

  // 8. Upload to Cloudinary
  let cloudinaryResult: { secureUrl: string; publicId: string };
  try {
    cloudinaryResult = await uploadToCloudinary(buffer, {
      folder:   `premasse/requests/${requestId}`,
      filename: file.name,
      mimeType: file.type,
    });
  } catch (err) {
    console.error("[api/upload] Cloudinary upload failed:", err);
    return NextResponse.json(
      { success: false, error: "File upload failed. Please try again." },
      { status: 500 }
    );
  }

  // 9. Save document metadata to DB
  const document = await prisma.document.create({
    data: {
      requestId,
      fileUrl:  cloudinaryResult.secureUrl,
      publicId: cloudinaryResult.publicId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    },
    select: {
      id:         true,
      fileName:   true,
      fileUrl:    true,
      fileType:   true,
      fileSize:   true,
      uploadedAt: true,
    },
  });

  console.info(
    `[api/upload] Document uploaded: ${document.id} for request ${requestId} (${file.name}, ${file.size} bytes)`
  );

  return NextResponse.json(
    { success: true, document },
    { status: 201 }
  );
}
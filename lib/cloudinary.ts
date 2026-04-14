// lib/cloudinary.ts
// Cloudinary v2 SDK configured from env vars.
// Import { cloudinary } from here — never instantiate directly.
// Used server-side only (API routes, server actions).

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure:     true,
});

export { cloudinary };

// ── Upload helper ─────────────────────────────────────────────────────────────
// Uploads a file buffer to a specific folder in Cloudinary.
// Returns the secure_url and public_id needed to store in the DB.

export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder:   string;       // e.g. "premasse/requests/clx123"
    filename: string;       // original file name, used as public_id
    mimeType: string;
  }
): Promise<{ secureUrl: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder:           options.folder,
        public_id:        sanitizeFilename(options.filename),
        resource_type:    "auto",   // handles PDFs, images, Word docs
        allowed_formats:  ["pdf", "jpg", "jpeg", "png", "doc", "docx"],
        // Prevent execution of uploaded files
        type:             "upload",
        // Tag for easy bulk management in Cloudinary console
        tags:             ["premasse", "request-document"],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload returned no result"));
        } else {
          resolve({
            secureUrl: result.secure_url,
            publicId:  result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

// ── Delete helper ─────────────────────────────────────────────────────────────
// Deletes a file from Cloudinary by its public_id.
// Called when admin or client removes a document.

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}

// ── Sanitize filename ─────────────────────────────────────────────────────────
// Cloudinary public_ids can't contain special chars.

function sanitizeFilename(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")          // strip extension
    .replace(/[^a-zA-Z0-9_-]/g, "_")  // replace special chars
    .slice(0, 100);                    // cap at 100 chars
}
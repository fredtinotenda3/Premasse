// components/dashboard/RequestDocuments.tsx
// Premium cinematic document manager for admin request details.
// Enhanced UI/UX while preserving all original logic.

"use client";

import { useState } from "react";

import {
  Download,
  FileImage,
  FileText,
  LoaderCircle,
  Trash2,
} from "lucide-react";

type Doc = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date | string;
};

type Props = {
  requestId: string;
  initialDocuments: Doc[];
};

export default function RequestDocuments({
  requestId,
  initialDocuments,
}: Props) {
  const [
    documents,
    setDocuments,
  ] = useState<Doc[]>(
    initialDocuments
  );

  const [
    deleting,
    setDeleting,
  ] = useState<
    string | null
  >(null);

  async function handleDelete(
    docId: string
  ) {
    if (
      !confirm(
        "Permanently delete this document?"
      )
    )
      return;

    setDeleting(docId);

    try {
      const res =
        await fetch(
          `/api/documents/${docId}`,
          {
            method:
              "DELETE",
          }
        );

      if (res.ok) {
        setDocuments(
          (
            prev
          ) =>
            prev.filter(
              (
                d
              ) =>
                d.id !==
                docId
            )
        );
      } else {
        alert(
          "Failed to delete document."
        );
      }
    } catch {
      alert(
        "Network error. Please try again."
      );
    } finally {
      setDeleting(
        null
      );
    }
  }

  // ───────────────────────────────────────────────────────────
  // Empty
  // ───────────────────────────────────────────────────────────

  if (
    documents.length === 0
  ) {
    return (
      <div
        className="
          rounded-[2rem]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          px-6
          py-12
          text-center
        "
      >

        <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center mx-auto mb-5">

          <FileText className="w-7 h-7 text-white/25" />
        </div>

        <p className="text-white/45 text-sm italic">
          No documents
          uploaded yet.
        </p>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {documents.map(
        (doc) => {
          const isPdf =
            doc.fileType.includes(
              "pdf"
            );

          const isImg =
            doc.fileType.includes(
              "image"
            );

          const isDeleting =
            deleting ===
            doc.id;

          return (
            <div
              key={doc.id}
              className="
                group
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-2xl
                p-5
                shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                hover:border-[#C9A84C]/20
                transition-all
                duration-500
              "
            >

              {/* Glow */}
              <div className="absolute top-[-70px] right-[-70px] w-[180px] h-[180px] rounded-full bg-[#C9A84C]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex items-start gap-4">

                {/* Icon */}
                <div
                  className={`
                    w-14
                    h-14
                    rounded-2xl
                    border
                    flex
                    items-center
                    justify-center
                    shrink-0
                    shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                    ${
                      isPdf
                        ? "border-red-500/20 bg-red-500/10 text-red-300"
                        : isImg
                          ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                          : "border-white/10 bg-white/[0.04] text-white/40"
                    }
                  `}
                >

                  {isImg ? (
                    <FileImage className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">

                  {/* Name */}
                  <a
                    href={
                      doc.fileUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      block
                      text-white
                      text-sm
                      sm:text-base
                      font-medium
                      leading-relaxed
                      hover:text-[#C9A84C]
                      transition-colors
                      duration-300
                      truncate
                    "
                  >
                    {
                      doc.fileName
                    }
                  </a>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">

                    <span className="text-white/35 text-xs uppercase tracking-[0.14em]">
                      {formatBytes(
                        doc.fileSize
                      )}
                    </span>

                    <span className="w-1 h-1 rounded-full bg-white/15" />

                    <span className="text-white/35 text-xs">
                      {new Date(
                        doc.uploadedAt
                      ).toLocaleDateString(
                        "en-ZW",
                        {
                          day: "numeric",
                          month:
                            "short",
                          year:
                            "numeric",
                        }
                      )}
                    </span>

                    {isPdf && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/15" />

                        <span className="text-red-300 text-[10px] uppercase tracking-[0.16em]">
                          PDF
                        </span>
                      </>
                    )}

                    {isImg && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-white/15" />

                        <span className="text-blue-300 text-[10px] uppercase tracking-[0.16em]">
                          Image
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-5">

                    {/* Open */}
                    <a
                      href={
                        doc.fileUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-[#C9A84C]/20
                        bg-[#C9A84C]/10
                        px-4
                        py-2.5
                        text-[#C9A84C]
                        text-xs
                        font-semibold
                        tracking-[0.14em]
                        uppercase
                        hover:bg-[#C9A84C]/15
                        transition-all
                        duration-300
                      "
                    >

                      <Download className="w-3.5 h-3.5" />

                      Open
                    </a>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        handleDelete(
                          doc.id
                        )
                      }
                      disabled={
                        isDeleting
                      }
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        px-4
                        py-2.5
                        text-white/45
                        text-xs
                        font-semibold
                        tracking-[0.14em]
                        uppercase
                        hover:text-red-300
                        hover:border-red-500/20
                        hover:bg-red-500/10
                        transition-all
                        duration-300
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >

                      {isDeleting ? (
                        <>
                          <LoaderCircle className="w-3.5 h-3.5 animate-spin" />

                          Deleting
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3.5 h-3.5" />

                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Format bytes
// ─────────────────────────────────────────────────────────────

function formatBytes(
  bytes: number
): string {
  if (bytes < 1024)
    return `${bytes} B`;

  if (
    bytes <
    1024 * 1024
  )
    return `${(
      bytes / 1024
    ).toFixed(0)} KB`;

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;
}
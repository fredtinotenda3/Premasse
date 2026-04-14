// components/dashboard/RequestDocuments.tsx
// Document section for the admin request detail page.
// Shows uploaded documents + allows admin to delete them.
// Extracted as a client component so deletion updates the list without page reload.

"use client";

import { useState } from "react";

type Doc = {
  id:         string;
  fileName:   string;
  fileUrl:    string;
  fileType:   string;
  fileSize:   number;
  uploadedAt: Date | string;
};

type Props = {
  requestId:         string;
  initialDocuments:  Doc[];
};

export default function RequestDocuments({ requestId, initialDocuments }: Props) {
  const [documents, setDocuments] = useState<Doc[]>(initialDocuments);
  const [deleting,  setDeleting]  = useState<string | null>(null);

  async function handleDelete(docId: string) {
    if (!confirm("Permanently delete this document?")) return;
    setDeleting(docId);
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== docId));
      } else {
        alert("Failed to delete document.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(null);
    }
  }

  if (documents.length === 0) {
    return (
      <p className="font-body text-slate/40 text-sm italic">
        No documents uploaded yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {documents.map(doc => {
        const isPdf = doc.fileType.includes("pdf");
        const isImg = doc.fileType.includes("image");
        const isDeleting = deleting === doc.id;

        return (
          <li
            key={doc.id}
            className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-sm px-4 py-3"
          >
            {/* Icon */}
            <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
              isPdf ? "bg-red-50" : isImg ? "bg-blue-50" : "bg-gray-100"
            }`}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"
                className={isPdf ? "text-red-400" : isImg ? "text-blue-400" : "text-slate/40"}>
                <path d="M3 1h6l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z"
                  stroke="currentColor" strokeWidth="1.2"/>
                <path d="M9 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-navy text-sm font-medium truncate block hover:underline underline-offset-2 decoration-gold"
              >
                {doc.fileName}
              </a>
              <p className="font-body text-slate/40 text-xs">
                {formatBytes(doc.fileSize)} ·{" "}
                {new Date(doc.uploadedAt).toLocaleDateString("en-ZW", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            </div>

            {/* Delete */}
            <button
              onClick={() => handleDelete(doc.id)}
              disabled={isDeleting}
              className="text-slate/25 hover:text-red-400 transition-colors shrink-0 disabled:opacity-50"
              aria-label="Delete document"
            >
              {isDeleting ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
                  <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 3.5h10M5.5 3.5V2.5h3v1M6 6v4M8 6v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <rect x="3" y="3.5" width="8" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

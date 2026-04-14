/* eslint-disable react-hooks/preserve-manual-memoization */
"use client";

// components/forms/DocumentUploader.tsx
// Drag-and-drop file uploader for service request documents.
// Uploads to /api/upload, shows per-file progress, allows deletion.
// Used on the request form (client-facing) and optionally in admin detail page.

import { useState, useCallback, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type UploadedDoc = {
  id:         string;
  fileName:   string;
  fileUrl:    string;
  fileType:   string;
  fileSize:   number;
  uploadedAt: string;
};

type FileEntry = {
  localId:   string;       // temporary ID before upload completes
  file:      File;
  status:    "queued" | "uploading" | "done" | "error";
  progress:  number;       // 0–100
  error?:    string;
  uploaded?: UploadedDoc;
};

type Props = {
  requestId:           string;
  initialDocuments?:   UploadedDoc[];
  onUploadComplete?:   (doc: UploadedDoc) => void;
  onDeleteComplete?:   (docId: string) => void;
  maxFiles?:           number;
  showDeleteButton?:   boolean;  // false on client-facing form, true in admin
};

const MAX_SIZE_MB    = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES  = new Set([
  "application/pdf",
  "image/jpeg", "image/jpg", "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_LABEL  = "PDF, JPG, PNG, DOC, DOCX";

// ── Component ─────────────────────────────────────────────────────────────────

export default function DocumentUploader({
  requestId,
  initialDocuments = [],
  onUploadComplete,
  onDeleteComplete,
  maxFiles = 10,
  showDeleteButton = false,
}: Props) {
  const [entries,    setEntries]    = useState<FileEntry[]>([]);
  const [uploaded,   setUploaded]   = useState<UploadedDoc[]>(initialDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalCount = uploaded.length + entries.filter(e => e.status !== "error").length;
  const atMax      = totalCount >= maxFiles;

  // ── File validation ─────────────────────────────────────────────────────────

  function validateFile(file: File): string | null {
    if (!ALLOWED_TYPES.has(file.type)) {
      return `${file.name}: file type not allowed. Use ${ALLOWED_LABEL}.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `${file.name}: file exceeds ${MAX_SIZE_MB} MB limit.`;
    }
    return null;
  }

  // ── Upload a single file ────────────────────────────────────────────────────

  async function uploadFile(entry: FileEntry) {
    const formData = new FormData();
    formData.append("file",      entry.file);
    formData.append("requestId", requestId);

    // Set to uploading
    setEntries(prev =>
      prev.map(e =>
        e.localId === entry.localId
          ? { ...e, status: "uploading", progress: 10 }
          : e
      )
    );

    // Fake progress ticks while waiting for server
    const progressInterval = setInterval(() => {
      setEntries(prev =>
        prev.map(e =>
          e.localId === entry.localId && e.status === "uploading" && e.progress < 85
            ? { ...e, progress: e.progress + 15 }
            : e
        )
      );
    }, 400);

    try {
      const res  = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();

      clearInterval(progressInterval);

      if (!json.success) {
        setEntries(prev =>
          prev.map(e =>
            e.localId === entry.localId
              ? { ...e, status: "error", progress: 0, error: json.error }
              : e
          )
        );
        return;
      }

      // Move to uploaded list, remove from entries
      const doc: UploadedDoc = json.document;
      setUploaded(prev => [...prev, doc]);
      setEntries(prev => prev.filter(e => e.localId !== entry.localId));
      onUploadComplete?.(doc);
    } catch {
      clearInterval(progressInterval);
      setEntries(prev =>
        prev.map(e =>
          e.localId === entry.localId
            ? { ...e, status: "error", progress: 0, error: "Network error. Please try again." }
            : e
        )
      );
    }
  }

  // ── Add files ───────────────────────────────────────────────────────────────

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxFiles - totalCount;
      const toAdd     = fileArray.slice(0, remaining);

      const newEntries: FileEntry[] = toAdd.map(file => {
        const error = validateFile(file);
        return {
          localId:  crypto.randomUUID(),
          file,
          status:   error ? "error" : "queued",
          progress: 0,
          error:    error ?? undefined,
        };
      });

      setEntries(prev => [...prev, ...newEntries]);

      // Start uploading valid files immediately
      newEntries
        .filter(e => e.status === "queued")
        .forEach(e => uploadFile(e));
    },
    [totalCount, maxFiles, requestId] // eslint-disable-line
  );

  // ── Drag handlers ───────────────────────────────────────────────────────────

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragLeave() { setIsDragging(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (!atMax) addFiles(e.dataTransfer.files);
  }

  // ── Delete uploaded doc ─────────────────────────────────────────────────────

  async function deleteDoc(docId: string) {
    if (!confirm("Remove this document?")) return;
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setUploaded(prev => prev.filter(d => d.id !== docId));
        onDeleteComplete?.(docId);
      }
    } catch {
      alert("Failed to delete document. Please try again.");
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* Drop zone */}
      {!atMax && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-sm px-6 py-10 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging
              ? "border-gold bg-gold-pale"
              : "border-gray-200 hover:border-gold/50 hover:bg-gray-50/50"
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="sr-only"
            onChange={e => e.target.files && addFiles(e.target.files)}
          />

          {/* Upload icon */}
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-slate/50">
              <path d="M9 12V4M9 4L6 7M9 4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <p className="font-body text-navy text-sm font-medium mb-1">
            {isDragging ? "Drop files here" : "Drag files here or click to browse"}
          </p>
          <p className="font-body text-slate/50 text-xs">
            {ALLOWED_LABEL} · Max {MAX_SIZE_MB} MB per file · Up to {maxFiles} files
          </p>
          {totalCount > 0 && (
            <p className="font-body text-slate/40 text-xs mt-1">
              {totalCount} of {maxFiles} uploaded
            </p>
          )}
        </div>
      )}

      {/* In-progress entries */}
      {entries.length > 0 && (
        <ul className="space-y-2">
          {entries.map(entry => (
            <FileRow
              key={entry.localId}
              name={entry.file.name}
              size={entry.file.size}
              status={entry.status}
              progress={entry.progress}
              error={entry.error}
              onRetry={() => {
                if (entry.status === "error" && !entry.error?.includes("type") && !entry.error?.includes("exceeds")) {
                  setEntries(prev =>
                    prev.map(e =>
                      e.localId === entry.localId
                        ? { ...e, status: "queued", error: undefined, progress: 0 }
                        : e
                    )
                  );
                  uploadFile({ ...entry, status: "queued", error: undefined });
                }
              }}
              onDismiss={() =>
                setEntries(prev => prev.filter(e => e.localId !== entry.localId))
              }
            />
          ))}
        </ul>
      )}

      {/* Successfully uploaded documents */}
      {uploaded.length > 0 && (
        <ul className="space-y-2">
          {uploaded.map(doc => (
            <div
              key={doc.id}
              className="flex items-center gap-3 bg-white border border-gray-100 rounded-sm px-4 py-3"
            >
              <FileTypeIcon mimeType={doc.fileType} />
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
                  {formatBytes(doc.fileSize)}
                </p>
              </div>
              {showDeleteButton && (
                <button
                  onClick={() => deleteDoc(doc.id)}
                  className="text-slate/30 hover:text-red-500 transition-colors shrink-0"
                  aria-label="Delete document"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </ul>
      )}

      {atMax && (
        <p className="font-body text-slate/50 text-xs text-center">
          Maximum of {maxFiles} documents reached.
        </p>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FileRow({
  name, size, status, progress, error, onRetry, onDismiss,
}: {
  name: string; size: number;
  status: FileEntry["status"]; progress: number;
  error?: string;
  onRetry: () => void; onDismiss: () => void;
}) {
  return (
    <div className={`bg-white border rounded-sm px-4 py-3 ${
      status === "error" ? "border-red-200 bg-red-50/30" : "border-gray-100"
    }`}>
      <div className="flex items-center gap-3">
        <FileTypeIcon mimeType="" />
        <div className="flex-1 min-w-0">
          <p className="font-body text-navy text-sm font-medium truncate">{name}</p>
          <p className="font-body text-slate/40 text-xs">{formatBytes(size)}</p>
        </div>
        {status === "uploading" && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin text-gold shrink-0">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
            <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
        {status === "done" && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-500 shrink-0">
            <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 shrink-0">
            {!error?.includes("type") && !error?.includes("exceeds") && (
              <button onClick={onRetry} className="font-body text-xs text-navy underline">
                Retry
              </button>
            )}
            <button onClick={onDismiss} className="text-slate/30 hover:text-red-500 transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {status === "uploading" && (
        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {status === "error" && error && (
        <p className="font-body text-red-600 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  const isPdf = mimeType.includes("pdf");
  const isImg = mimeType.includes("image");

  return (
    <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${
      isPdf ? "bg-red-50"   :
      isImg ? "bg-blue-50"  :
              "bg-gray-100"
    }`}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        className={isPdf ? "text-red-500" : isImg ? "text-blue-500" : "text-slate/50"}
      >
        <path
          d="M3 1h6l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z"
          stroke="currentColor" strokeWidth="1.2"
        />
        <path d="M9 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

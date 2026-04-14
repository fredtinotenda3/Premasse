// components/dashboard/AuditTimeline.tsx
// Renders the audit log for a request as a vertical timeline.
// Each entry shows who changed the status, from what, to what, and when.

import { formatDistanceToNow } from "date-fns";

type AuditEntry = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  createdAt: Date;
  admin: {
    name: string;
    email: string;
  };
};

type Props = {
  entries: AuditEntry[];
};

const STATUS_LABELS: Record<string, string> = {
  PENDING:       "Pending",
  IN_REVIEW:     "In review",
  IN_PROGRESS:   "In progress",
  AWAITING_DOCS: "Awaiting docs",
  COMPLETED:     "Completed",
  CANCELLED:     "Cancelled",
};

export default function AuditTimeline({ entries }: Props) {
  if (entries.length === 0) {
    return (
      <p className="font-body text-slate/50 text-sm italic">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-0">
      {entries.map((entry, i) => {
        const isLast = i === entries.length - 1;
        return (
          <li key={entry.id} className="relative flex gap-4 pb-6">
            {/* Vertical connector line */}
            {!isLast && (
              <div className="absolute left-2.75 top-6 bottom-0 w-px bg-gray-100" />
            )}

            {/* Dot */}
            <div
              className={`relative z-10 shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                i === 0
                  ? "bg-navy border-navy"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  i === 0 ? "bg-gold" : "bg-gray-300"
                }`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                {/* Status transition */}
                <span className="font-body text-navy text-sm font-medium">
                  {entry.fromStatus
                    ? `${STATUS_LABELS[entry.fromStatus] ?? entry.fromStatus} → ${STATUS_LABELS[entry.toStatus] ?? entry.toStatus}`
                    : `Set to ${STATUS_LABELS[entry.toStatus] ?? entry.toStatus}`}
                </span>
                {/* Time */}
                <span className="font-body text-slate/50 text-xs">
                  {formatDistanceToNow(new Date(entry.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Who did it */}
              <p className="font-body text-slate/60 text-xs mb-1">
                by {entry.admin.name}
              </p>

              {/* Optional note */}
              {entry.note && (
                <p className="font-body text-slate text-sm bg-gray-50 border border-gray-100 rounded-sm px-3 py-2 mt-2">
                  {entry.note}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

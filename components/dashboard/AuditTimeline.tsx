// components/dashboard/AuditTimeline.tsx
// Premium cinematic audit timeline for admin request activity.
// Enhanced UI/UX while preserving all original logic.

import { formatDistanceToNow } from "date-fns";

import {
  ArrowRight,
  Clock3,
  MessageSquareText,
  User2,
} from "lucide-react";

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

const STATUS_LABELS: Record<
  string,
  string
> = {
  PENDING:
    "Pending",

  IN_REVIEW:
    "In review",

  IN_PROGRESS:
    "In progress",

  AWAITING_DOCS:
    "Awaiting docs",

  COMPLETED:
    "Completed",

  CANCELLED:
    "Cancelled",
};

const STATUS_STYLES: Record<
  string,
  string
> = {
  PENDING:
    "bg-amber-500/10 border-amber-500/20 text-amber-300",

  IN_REVIEW:
    "bg-blue-500/10 border-blue-500/20 text-blue-300",

  IN_PROGRESS:
    "bg-purple-500/10 border-purple-500/20 text-purple-300",

  AWAITING_DOCS:
    "bg-orange-500/10 border-orange-500/20 text-orange-300",

  COMPLETED:
    "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",

  CANCELLED:
    "bg-white/[0.04] border-white/10 text-white/45",
};

export default function AuditTimeline({
  entries,
}: Props) {
  if (entries.length === 0) {
    return (
      <div
        className="
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-xl
          px-6
          py-10
          text-center
        "
      >

        <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center mx-auto mb-5">

          <Clock3 className="w-6 h-6 text-white/30" />
        </div>

        <p className="text-white/45 text-sm italic">
          No activity recorded
          yet.
        </p>
      </div>
    );
  }

  return (
    <ol className="relative">

      {entries.map(
        (entry, i) => {
          const isLast =
            i ===
            entries.length -
              1;

          return (
            <li
              key={entry.id}
              className="relative flex gap-5 pb-8"
            >

              {/* Timeline */}
              <div className="relative flex flex-col items-center shrink-0">

                {/* Line */}
                {!isLast && (
                  <div className="absolute top-10 bottom-[-2rem] left-1/2 -translate-x-1/2 w-px bg-white/10" />
                )}

                {/* Dot */}
                <div
                  className={`
                    relative
                    z-10
                    w-10
                    h-10
                    rounded-2xl
                    border
                    flex
                    items-center
                    justify-center
                    backdrop-blur-xl
                    shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                    ${
                      i === 0
                        ? "border-[#C9A84C]/20 bg-[#C9A84C]/10"
                        : "border-white/10 bg-white/[0.03]"
                    }
                  `}
                >

                  <div
                    className={`
                      w-3
                      h-3
                      rounded-full
                      ${
                        i === 0
                          ? "bg-[#C9A84C] shadow-[0_0_20px_rgba(201,168,76,0.7)]"
                          : "bg-white/30"
                      }
                    `}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-white/10
                    bg-white/[0.03]
                    backdrop-blur-2xl
                    p-5
                    shadow-[0_20px_60px_rgba(0,0,0,0.18)]
                  "
                >

                  {/* Glow */}
                  <div className="absolute top-[-60px] right-[-60px] w-[180px] h-[180px] rounded-full bg-[#C9A84C]/5 blur-3xl" />

                  <div className="relative">

                    {/* Top row */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">

                      <div className="flex flex-wrap items-center gap-2">

                        {/* From */}
                        {entry.fromStatus && (
                          <>
                            <span
                              className={`
                                inline-flex
                                items-center
                                rounded-full
                                border
                                px-3
                                py-1
                                text-[10px]
                                uppercase
                                tracking-[0.16em]
                                font-semibold
                                ${
                                  STATUS_STYLES[
                                    entry.fromStatus
                                  ] ??
                                  "border-white/10 bg-white/[0.04] text-white/45"
                                }
                              `}
                            >
                              {STATUS_LABELS[
                                entry.fromStatus
                              ] ??
                                entry.fromStatus}
                            </span>

                            <ArrowRight className="w-3.5 h-3.5 text-white/25" />
                          </>
                        )}

                        {/* To */}
                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-full
                            border
                            px-3
                            py-1
                            text-[10px]
                            uppercase
                            tracking-[0.16em]
                            font-semibold
                            ${
                              STATUS_STYLES[
                                entry.toStatus
                              ] ??
                              "border-white/10 bg-white/[0.04] text-white/45"
                            }
                          `}
                        >
                          {entry.fromStatus
                            ? STATUS_LABELS[
                                entry.toStatus
                              ] ??
                              entry.toStatus
                            : `Set to ${
                                STATUS_LABELS[
                                  entry.toStatus
                                ] ??
                                entry.toStatus
                              }`}
                        </span>
                      </div>

                      {/* Time */}
                      <div className="inline-flex items-center gap-2 text-white/35 text-xs shrink-0">

                        <Clock3 className="w-3.5 h-3.5" />

                        <span>
                          {formatDistanceToNow(
                            new Date(
                              entry.createdAt
                            ),
                            {
                              addSuffix:
                                true,
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* User */}
                    <div className="flex items-center gap-3 mb-4">

                      <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center shrink-0">

                        <User2 className="w-4 h-4 text-[#C9A84C]" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-white text-sm font-medium truncate">
                          {
                            entry.admin
                              .name
                          }
                        </p>

                        <p className="text-white/35 text-xs truncate">
                          {
                            entry.admin
                              .email
                          }
                        </p>
                      </div>
                    </div>

                    {/* Note */}
                    {entry.note && (
                      <div
                        className="
                          rounded-2xl
                          border
                          border-white/10
                          bg-black/10
                          px-4
                          py-4
                        "
                      >

                        <div className="flex items-start gap-3">

                          <div className="w-9 h-9 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center shrink-0">

                            <MessageSquareText className="w-4 h-4 text-[#C9A84C]" />
                          </div>

                          <div>

                            <p className="text-white/30 text-[10px] uppercase tracking-[0.18em] mb-2">
                              Internal note
                            </p>

                            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                              {
                                entry.note
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        }
      )}
    </ol>
  );
}
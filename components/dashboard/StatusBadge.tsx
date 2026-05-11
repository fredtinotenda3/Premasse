// components/dashboard/StatusBadge.tsx
// Premium cinematic status badge component.

import { RequestStatus } from "@prisma/client";

const STATUS_CONFIG: Record<
  RequestStatus,
  {
    label: string;
    classes: string;
    dot: string;
  }
> = {
  PENDING: {
    label: "Pending",

    classes:
      "border-amber-500/20 bg-amber-500/10 text-amber-300",

    dot: "bg-amber-400",
  },

  IN_REVIEW: {
    label: "In review",

    classes:
      "border-blue-500/20 bg-blue-500/10 text-blue-300",

    dot: "bg-blue-400",
  },

  IN_PROGRESS: {
    label: "In progress",

    classes:
      "border-purple-500/20 bg-purple-500/10 text-purple-300",

    dot: "bg-purple-400",
  },

  AWAITING_DOCS: {
    label:
      "Awaiting docs",

    classes:
      "border-orange-500/20 bg-orange-500/10 text-orange-300",

    dot: "bg-orange-400",
  },

  COMPLETED: {
    label: "Completed",

    classes:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

    dot: "bg-emerald-400",
  },

  CANCELLED: {
    label: "Cancelled",

    classes:
      "border-white/10 bg-white/[0.04] text-white/40",

    dot: "bg-white/30",
  },

  AWAITING_PAYMENT: {
    label:
      "Awaiting payment",

    classes:
      "border-pink-500/20 bg-pink-500/10 text-pink-300",

    dot: "bg-pink-400",
  },
};

type Props = {
  status: RequestStatus;
  size?: "sm" | "md";
};

export default function StatusBadge({
  status,
  size = "md",
}: Props) {
  const {
    label,
    classes,
    dot,
  } = STATUS_CONFIG[status];

  const sizeClasses =
    size === "sm"
      ? `
          text-[10px]
          px-3
          py-1
          tracking-[0.16em]
          gap-2
        `
      : `
          text-[11px]
          px-4
          py-1.5
          tracking-[0.18em]
          gap-2.5
        `;

  const dotSize =
    size === "sm"
      ? "w-1.5 h-1.5"
      : "w-2 h-2";

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        font-semibold
        uppercase
        backdrop-blur-md
        transition-all
        duration-300
        ${sizeClasses}
        ${classes}
      `}
    >

      <span
        className={`
          rounded-full
          shrink-0
          ${dot}
          ${dotSize}
        `}
      />

      {label}
    </span>
  );
}
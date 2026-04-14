// components/dashboard/StatusBadge.tsx
// Renders a colour-coded pill for each RequestStatus value.
// Used in both the requests table and the detail page.

import { RequestStatus } from "@prisma/client";

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; classes: string }
> = {
    PENDING: {
        label: "Pending",
        classes: "bg-amber-50 text-amber-800 border-amber-200",
    },
    IN_REVIEW: {
        label: "In review",
        classes: "bg-blue-50 text-blue-800 border-blue-200",
    },
    IN_PROGRESS: {
        label: "In progress",
        classes: "bg-purple-50 text-purple-800 border-purple-200",
    },
    AWAITING_DOCS: {
        label: "Awaiting docs",
        classes: "bg-orange-50 text-orange-800 border-orange-200",
    },
    COMPLETED: {
        label: "Completed",
        classes: "bg-green-50 text-green-800 border-green-200",
    },
    CANCELLED: {
        label: "Cancelled",
        classes: "bg-gray-100 text-gray-500 border-gray-200",
    },
    AWAITING_PAYMENT: {
        label: "",
        classes: ""
    }
};

type Props = {
  status: RequestStatus;
  size?: "sm" | "md";
};

export default function StatusBadge({ status, size = "md" }: Props) {
  const { label, classes } = STATUS_CONFIG[status];
  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 tracking-[0.12em]"
      : "text-xs px-2.5 py-1 tracking-[0.1em]";

  return (
    <span
      className={`inline-block font-body font-semibold uppercase border rounded-sm ${sizeClasses} ${classes}`}
    >
      {label}
    </span>
  );
}

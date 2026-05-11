"use client";

// components/portal/PortalInvoiceButton.tsx
// Premium client-facing invoice download button.

import { useState } from "react";

import {
  Download,
  FileText,
} from "lucide-react";

type Props = {
  paymentId: string;
  amount: number;
  currency?: string;
};

export default function PortalInvoiceButton({
  paymentId,
  amount,
  currency = "USD",
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleDownload() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/invoice/${paymentId}`
      );

      if (!res.ok) {
        const json =
          await res
            .json()
            .catch(() => ({}));

        setError(
          json.error ??
            "Could not download invoice."
        );

        return;
      }

      const blob =
        await res.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      const disposition =
        res.headers.get(
          "Content-Disposition"
        ) ?? "";

      const match =
        disposition.match(
          /filename="(.+)"/
        );

      a.download = match
        ? match[1]
        : "Premasse-Invoice.pdf";

      document.body.appendChild(
        a
      );

      a.click();

      document.body.removeChild(
        a
      );

      window.URL.revokeObjectURL(
        url
      );
    } catch {
      setError(
        "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">

      <button
        onClick={handleDownload}
        disabled={loading}
        className="
          group
          relative
          overflow-hidden
          inline-flex
          items-center
          gap-3
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-md
          px-6
          py-4
          text-white
          hover:border-[#C9A84C]/20
          hover:-translate-y-1
          transition-all
          duration-500
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:translate-y-0
        "
      >

        {/* Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#C9A84C]/10 via-transparent to-transparent" />

        <div className="relative z-10 flex items-center gap-4">

          {/* Icon */}
          <div
            className="
              w-11
              h-11
              rounded-2xl
              border
              border-[#C9A84C]/20
              bg-[#C9A84C]/10
              flex
              items-center
              justify-center
              shrink-0
            "
          >

            {loading ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="animate-spin text-[#C9A84C]"
              >

                <circle
                  cx="9"
                  cy="9"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeOpacity="0.25"
                />

                <path
                  d="M15 9a6 6 0 00-6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <FileText className="w-5 h-5 text-[#C9A84C]" />
            )}
          </div>

          {/* Content */}
          <div className="text-left">

            <p className="text-white text-sm font-medium leading-none mb-1">

              {loading
                ? "Generating receipt…"
                : "Download receipt"}
            </p>

            <p className="text-white/45 text-xs uppercase tracking-[0.16em]">

              {currency}{" "}
              {amount.toFixed(2)}
            </p>
          </div>

          {!loading && (
            <Download className="w-4 h-4 text-white/35 group-hover:text-[#C9A84C] transition-colors duration-300 ml-2" />
          )}
        </div>
      </button>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 flex gap-3 items-start">

          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="text-red-400 shrink-0 mt-0.5"
          >
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke="currentColor"
              strokeWidth="1.4"
            />

            <path
              d="M7 4.5v2.5M7 9h.01"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>

          <p className="text-red-300 text-sm leading-relaxed">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
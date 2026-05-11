// components/dashboard/InvoiceButton.tsx
// Premium cinematic invoice download button for admin dashboard.
// Enhanced UI/UX while preserving all original logic.

"use client";

import { useState } from "react";

import {
  CheckCircle2,
  Download,
  FileText,
  LoaderCircle,
} from "lucide-react";

type Props = {
  paymentId: string;
  clientName: string;
  amount: number;
  status: string;
};

export default function InvoiceButton({
  paymentId,
  clientName,
  amount,
  status,
}: Props) {
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  if (status !== "PAID")
    return null;

  async function handleDownload() {
    setLoading(true);

    setError("");

    try {
      const res =
        await fetch(
          `/api/invoice/${paymentId}`
        );

      if (!res.ok) {
        const json =
          await res
            .json()
            .catch(
              () => ({})
            );

        setError(
          json.error ??
            "Failed to generate invoice."
        );

        return;
      }

      // Download
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

      // Filename
      const disposition =
        res.headers.get(
          "Content-Disposition"
        ) ?? "";

      const match =
        disposition.match(
          /filename="(.+)"/
        );

      a.download =
        match
          ? match[1]
          : `Invoice-${paymentId}.pdf`;

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

      {/* Card */}
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-emerald-500/20
          bg-emerald-500/10
          backdrop-blur-2xl
          p-5
          shadow-[0_20px_60px_rgba(0,0,0,0.18)]
        "
      >

        {/* Glow */}
        <div className="absolute top-[-70px] right-[-70px] w-[180px] h-[180px] rounded-full bg-emerald-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex items-start gap-4">

          {/* Icon */}
          <div
            className="
              w-14
              h-14
              rounded-2xl
              border
              border-emerald-500/20
              bg-emerald-500/10
              flex
              items-center
              justify-center
              shrink-0
              shadow-[0_10px_30px_rgba(16,185,129,0.12)]
            "
          >

            <FileText className="w-6 h-6 text-emerald-300" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* Top */}
            <div className="flex flex-wrap items-center gap-2 mb-2">

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                  px-3
                  py-1
                  text-[10px]
                  uppercase
                  tracking-[0.16em]
                  font-semibold
                  text-emerald-300
                "
              >

                <CheckCircle2 className="w-3 h-3" />

                Paid
              </span>

              <span className="text-white/30 text-[10px] uppercase tracking-[0.16em]">
                Invoice ready
              </span>
            </div>

            {/* Heading */}
            <h3 className="text-white text-base font-medium leading-relaxed mb-1 truncate">
              {clientName}
            </h3>

            {/* Amount */}
            <p className="text-white/55 text-sm mb-5">
              Download payment
              invoice for{" "}
              <span className="text-emerald-300 font-medium">
                $
                {amount.toFixed(
                  2
                )}{" "}
                USD
              </span>
            </p>

            {/* Button */}
            <button
              onClick={
                handleDownload
              }
              disabled={loading}
              className="
                group/button
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                px-5
                py-3
                text-white/70
                text-xs
                font-semibold
                tracking-[0.16em]
                uppercase
                hover:text-white
                hover:border-[#C9A84C]/20
                hover:bg-[#C9A84C]/10
                transition-all
                duration-300
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              {loading ? (
                <>
                  <LoaderCircle className="w-4 h-4 animate-spin text-[#C9A84C]" />

                  Generating PDF
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-[#C9A84C] transition-transform duration-300 group-hover/button:translate-y-0.5" />

                  Download invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            rounded-2xl
            border
            border-red-500/20
            bg-red-500/10
            px-4
            py-3
          "
        >

          <p className="text-red-200 text-xs leading-relaxed text-center">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}
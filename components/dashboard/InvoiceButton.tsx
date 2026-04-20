"use client";

// components/dashboard/InvoiceButton.tsx
// Admin button to download a PDF invoice for a paid payment.
// Placed in the request detail page alongside the PaymentPanel.

import { useState } from "react";

type Props = {
  paymentId:    string;
  clientName:   string;
  amount:       number;
  status:       string;
};

export default function InvoiceButton({ paymentId, clientName, amount, status }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  if (status !== "PAID") return null;

  async function handleDownload() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invoice/${paymentId}`);

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Failed to generate invoice.");
        return;
      }

      // Trigger download
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;

      // Get filename from Content-Disposition header
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match        = disposition.match(/filename="(.+)"/);
      a.download         = match ? match[1] : `Invoice-${paymentId}.pdf`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 font-body text-sm text-navy border border-navy/20 hover:border-navy/50 px-4 py-2.5 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
              <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Generating PDF…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 1h6l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M9 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M7 6v4M5 8l2 2 2-2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download invoice (${amount.toFixed(2)} USD)
          </>
        )}
      </button>

      {error && (
        <p className="font-body text-red-600 text-xs text-center">{error}</p>
      )}
    </div>
  );
}

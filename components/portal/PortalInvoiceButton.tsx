"use client";

// components/portal/PortalInvoiceButton.tsx
// Client-facing invoice download button on the request detail page.
// Shows when a payment is PAID — lets the client download their receipt.

import { useState } from "react";

type Props = {
  paymentId: string;
  amount:    number;
  currency?: string;
};

export default function PortalInvoiceButton({ paymentId, amount, currency = "USD" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function handleDownload() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invoice/${paymentId}`);

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setError(json.error ?? "Could not download invoice.");
        return;
      }

      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;

      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match        = disposition.match(/filename="(.+)"/);
      a.download         = match ? match[1] : `Premasse-Invoice.pdf`;

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
    <div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 font-body text-navy text-sm underline underline-offset-2 decoration-gold hover:decoration-2 transition-all disabled:opacity-50"
      >
        {loading ? (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="animate-spin">
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
              <path d="M10 6a4 4 0 00-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Generating…
          </>
        ) : (
          <>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 1h5l3 3v7a1 1 0 01-1 1H2a1 1 0 01-1-1V2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              <path d="M6 5v3M4.5 7l1.5 1.5L7.5 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download receipt (${currency} {amount.toFixed(2)})
          </>
        )}
      </button>
      {error && <p className="font-body text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

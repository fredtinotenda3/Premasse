"use client";

// components/dashboard/PaymentPanel.tsx
// Admin UI for initiating and tracking a payment on a service request.
// Embedded in the request detail page alongside the status update form.

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type PaymentStatus =
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

type ExistingPayment = {
  id:          string;
  amount:      number;
  status:      PaymentStatus;
  method:      string | null;
  redirectUrl: string | null;
  createdAt:   string;
  paidAt:      string | null;
};

type Props = {
  requestId:       string;
  existingPayment: ExistingPayment | null;
};

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PaymentStatus, { label: string; classes: string }> = {
  PENDING:          { label: "Pending",          classes: "bg-gray-100 text-gray-500 border-gray-200" },
  AWAITING_PAYMENT: { label: "Awaiting payment", classes: "bg-amber-50 text-amber-800 border-amber-200" },
  PAID:             { label: "Paid",             classes: "bg-green-50 text-green-800 border-green-200" },
  FAILED:           { label: "Failed",           classes: "bg-red-50 text-red-700 border-red-200" },
  CANCELLED:        { label: "Cancelled",        classes: "bg-gray-100 text-gray-500 border-gray-200" },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PaymentPanel({ requestId, existingPayment }: Props) {
  const [payment,    setPayment]    = useState<ExistingPayment | null>(existingPayment);
  const [amount,     setAmount]     = useState<string>("");
  const [method,     setMethod]     = useState<"web" | "ecocash" | "onemoney">("web");
  const [phone,      setPhone]      = useState<string>("");
  const [loading,    setLoading]    = useState(false);
  const [polling,    setPolling]    = useState(false);
  const [error,      setError]      = useState<string>("");
  const [result,     setResult]     = useState<{
    redirectUrl?: string;
    instructions?: string;
  } | null>(null);

  // ── Initiate payment ────────────────────────────────────────────────────────

  async function handleInitiate() {
    setError("");
    setResult(null);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid amount greater than 0.");
      return;
    }
    if (method !== "web" && !phone.match(/^(\+263|0)[0-9]{9}$/)) {
      setError("Enter a valid Zimbabwean phone number for mobile payment.");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/paynow/initiate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ requestId, amount: amountNum, method, phone: phone || undefined }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Failed to initiate payment.");
        return;
      }

      // Update local payment state
      setPayment({
        id:          json.paymentId,
        amount:      amountNum,
        status:      "AWAITING_PAYMENT",
        method,
        redirectUrl: json.redirectUrl ?? null,
        createdAt:   new Date().toISOString(),
        paidAt:      null,
      });

      setResult({
        redirectUrl:  json.redirectUrl,
        instructions: json.instructions,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Poll for status ─────────────────────────────────────────────────────────

  async function handlePoll() {
    if (!payment) return;
    setPolling(true);
    try {
      const res  = await fetch(`/api/paynow/poll?paymentId=${payment.id}`);
      const json = await res.json();
      if (json.success && json.changed) {
        setPayment(prev => prev ? { ...prev, status: json.status } : prev);
      }
    } catch {
      // Silent fail — polling is best-effort
    } finally {
      setPolling(false);
    }
  }

  // ── Render: existing payment ────────────────────────────────────────────────

  if (payment) {
    const config = STATUS_CONFIG[payment.status];
    const isPending  = payment.status === "AWAITING_PAYMENT";
    const isTerminal = ["PAID", "FAILED", "CANCELLED"].includes(payment.status);

    return (
      <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
        <h2 className="font-display text-navy text-base font-semibold">Payment</h2>

        {/* Status + amount */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-slate/50 text-xs uppercase tracking-wider mb-1">
              Amount
            </p>
            <p className="font-display text-navy text-2xl font-bold">
              ${payment.amount.toFixed(2)}
              <span className="font-body text-slate/40 text-sm font-normal ml-1">USD</span>
            </p>
          </div>
          <span className={`inline-block font-body font-semibold text-xs px-2.5 py-1 rounded-sm border uppercase tracking-widest ${config.classes}`}>
            {config.label}
          </span>
        </div>

        {/* Method */}
        <div className="flex gap-4 font-body text-sm">
          <div>
            <p className="text-slate/40 text-xs mb-0.5">Method</p>
            <p className="text-navy capitalize">{payment.method ?? "—"}</p>
          </div>
          {payment.paidAt && (
            <div>
              <p className="text-slate/40 text-xs mb-0.5">Paid at</p>
              <p className="text-navy">
                {new Date(payment.paidAt).toLocaleString("en-ZW", {
                  dateStyle: "medium", timeStyle: "short",
                })}
              </p>
            </div>
          )}
        </div>

        {/* Result box — redirect link or mobile instructions */}
        {result?.redirectUrl && isPending && (
          <div className="bg-gold-pale border border-gold/20 rounded-sm p-4 space-y-3">
            <p className="font-body text-navy text-sm font-medium">
              Payment link ready
            </p>
            <p className="font-body text-slate text-xs leading-relaxed">
              Send this link to the client so they can complete payment on Paynow:
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={result.redirectUrl}
                className="font-mono text-xs bg-white border border-gray-200 rounded-sm px-3 py-2 flex-1 text-slate/70 truncate"
              />
              <button
                onClick={() => navigator.clipboard.writeText(result.redirectUrl!)}
                className="font-body text-xs text-navy border border-navy/20 hover:border-navy/50 px-3 py-2 rounded-sm transition-colors shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {result?.instructions && isPending && (
          <div className="bg-blue-50 border border-blue-100 rounded-sm p-4">
            <p className="font-body text-navy text-sm font-medium mb-2">
              Mobile payment instructions
            </p>
            <p className="font-body text-slate text-sm leading-relaxed whitespace-pre-wrap">
              {result.instructions}
            </p>
          </div>
        )}

        {/* Poll button for pending payments */}
        {isPending && (
          <button
            onClick={handlePoll}
            disabled={polling}
            className="w-full font-body text-sm text-slate/60 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2"
          >
            {polling ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
                  <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
                  <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Checking…
              </>
            ) : (
              "Check payment status"
            )}
          </button>
        )}

        {/* Terminal state message */}
        {payment.status === "PAID" && (
          <p className="font-body text-green-700 text-sm text-center">
            Payment confirmed. Request status has been advanced to In Progress.
          </p>
        )}
        {payment.status === "FAILED" && (
          <p className="font-body text-red-600 text-sm text-center">
            Payment failed. You can initiate a new payment request.
          </p>
        )}
      </div>
    );
  }

  // ── Render: initiation form ─────────────────────────────────────────────────

  return (
    <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
      <h2 className="font-display text-navy text-base font-semibold">Initiate payment</h2>
      <p className="font-body text-slate/60 text-sm leading-relaxed">
        Set the agreed amount and payment method. For web checkout, you&apos;ll get a
        link to send to the client. For EcoCash/OneMoney, the client gets a prompt
        on their phone.
      </p>

      {/* Amount */}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">
          Amount (USD) <span className="text-gold">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-slate/40 text-sm">$</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="font-body text-navy text-sm w-full bg-white border border-gray-200 rounded-sm pl-7 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
          />
        </div>
      </div>

      {/* Method */}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">
          Payment method <span className="text-gold">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["web", "ecocash", "onemoney"] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`font-body text-sm py-2.5 px-3 rounded-sm border transition-colors capitalize ${
                method === m
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-slate border-gray-200 hover:border-gray-300"
              }`}
            >
              {m === "web" ? "Web / Card" : m === "ecocash" ? "EcoCash" : "OneMoney"}
            </button>
          ))}
        </div>
      </div>

      {/* Phone (mobile only) */}
      {method !== "web" && (
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-navy text-sm font-medium">
            Client phone number <span className="text-gold">*</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+263 77 123 4567"
            className="font-body text-navy text-sm w-full bg-white border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
          />
          <p className="font-body text-slate/50 text-xs">
            {method === "ecocash" ? "Econet" : "NetOne"} number only.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 flex gap-2 items-start">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-500 shrink-0 mt-0.5">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 4v3M7 9.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="font-body text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleInitiate}
        disabled={loading}
        className="btn-gold w-full font-body font-semibold text-navy px-4 py-3 rounded-sm text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
              <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Sending to Paynow…
          </>
        ) : (
          "Send payment request"
        )}
      </button>
    </div>
  );
}

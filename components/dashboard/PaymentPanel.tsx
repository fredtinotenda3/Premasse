"use client";

// components/dashboard/PaymentPanel.tsx
// Admin UI for initiating and tracking payments with one-click send to client

import { useState, useEffect } from "react";

// ── Types ───────────────────────────────────────────────────────────────────

type PaymentStatus =
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

type ExistingPayment = {
  id: string;
  amount: number;
  status: PaymentStatus;
  method: string | null;
  redirectUrl: string | null;
  createdAt: string;
  paidAt: string | null;
};

type Props = {
  requestId: string;
  existingPayment: ExistingPayment | null;
};

// ── Status config ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PaymentStatus, { label: string; classes: string }> = {
  PENDING: { label: "Pending", classes: "bg-gray-100 text-gray-500 border-gray-200" },
  AWAITING_PAYMENT: { label: "Awaiting payment", classes: "bg-amber-50 text-amber-800 border-amber-200" },
  PAID: { label: "Paid", classes: "bg-green-50 text-green-800 border-green-200" },
  FAILED: { label: "Failed", classes: "bg-red-50 text-red-700 border-red-200" },
  CANCELLED: { label: "Cancelled", classes: "bg-gray-100 text-gray-500 border-gray-200" },
};

// ── Component ───────────────────────────────────────────────────────────────

export default function PaymentPanel({ requestId, existingPayment }: Props) {
  const [payment, setPayment] = useState<ExistingPayment | null>(existingPayment);
  const [amount, setAmount] = useState<string>("");
  const [method, setMethod] = useState<"web" | "ecocash" | "onemoney">("web");
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [sending, setSending] = useState<"email" | "whatsapp" | null>(null);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [clientDetails, setClientDetails] = useState<{ email: string; name: string; phone: string } | null>(null);
  const [result, setResult] = useState<{
    redirectUrl?: string;
    instructions?: string;
    clientEmail?: string;
    clientName?: string;
    clientPhone?: string;
  } | null>(null);

  // Fetch client details when component mounts or payment changes
  useEffect(() => {
    async function fetchClientDetails() {
      try {
        const res = await fetch(`/api/requests/${requestId}`);
        const json = await res.json();
        if (json.success && json.request) {
          setClientDetails({
            email: json.request.clientEmail,
            name: json.request.clientName,
            phone: json.request.clientPhone,
          });
        }
      } catch (err) {
        console.error("Failed to fetch client details:", err);
      }
    }
    fetchClientDetails();
  }, [requestId]);

  // ── Cancel pending payment ───────────────────────────────────────────────
  async function handleCancelPayment() {
    if (!payment) return;
    if (!confirm("Cancel this payment request? You can create a new one after.")) return;
    
    setCancelling(true);
    setError("");
    
    try {
      const res = await fetch(`/api/payments/${payment.id}/cancel`, {
        method: "POST",
      });
      const json = await res.json();
      
      if (json.success) {
        setPayment({ ...payment, status: "CANCELLED" });
        setResult(null);
      } else {
        setError(json.error ?? "Failed to cancel payment.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  // ── Initiate payment ────────────────────────────────────────────────────
  async function handleInitiate() {
    setError("");
    setResult(null);
    setSendSuccess(null);

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
      const res = await fetch("/api/paynow/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, amount: amountNum, method, phone: phone || undefined }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Failed to initiate payment.");
        return;
      }

      setPayment({
        id: json.paymentId,
        amount: amountNum,
        status: "AWAITING_PAYMENT",
        method,
        redirectUrl: json.redirectUrl ?? null,
        createdAt: new Date().toISOString(),
        paidAt: null,
      });

      setResult({
        redirectUrl: json.redirectUrl,
        instructions: json.instructions,
        clientEmail: clientDetails?.email,
        clientName: clientDetails?.name,
        clientPhone: clientDetails?.phone,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Send payment link via email ─────────────────────────────────────────
  async function sendEmailLink(redirectUrl: string, amountNum: number, recipientEmail?: string, recipientName?: string) {
    const to = recipientEmail || clientDetails?.email;
    if (!to || !redirectUrl) {
      setError("No email address on file for this client.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    setSending("email");
    setSendSuccess(null);
    setError("");
    
    try {
      const res = await fetch("/api/payments/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to,
          clientName: recipientName || clientDetails?.name,
          amount: amountNum,
          paymentLink: redirectUrl,
          requestId: requestId,
          method: "email",
        }),
      });
      const json = await res.json();
      
      if (json.success) {
        setSendSuccess(`✅ Payment link sent to ${to}`);
        setTimeout(() => setSendSuccess(null), 5000);
      } else {
        setError(json.error ?? "Failed to send email.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(null);
    }
  }

  // ── Send payment link via WhatsApp ──────────────────────────────────────
  async function sendWhatsAppLink(redirectUrl: string, amountNum: number, recipientPhone?: string, recipientName?: string) {
    const to = recipientPhone || clientDetails?.phone;
    if (!to || !redirectUrl) {
      setError("No phone number on file for this client.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    setSending("whatsapp");
    setSendSuccess(null);
    setError("");
    
    try {
      const res = await fetch("/api/payments/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to,
          clientName: recipientName || clientDetails?.name,
          amount: amountNum,
          paymentLink: redirectUrl,
          requestId: requestId,
          method: "whatsapp",
        }),
      });
      const json = await res.json();
      
      if (json.success) {
        setSendSuccess(`✅ Payment link sent via WhatsApp to ${to}`);
        setTimeout(() => setSendSuccess(null), 5000);
      } else {
        setError(json.error ?? "Failed to send WhatsApp message.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(null);
    }
  }

  // ── Copy link to clipboard ──────────────────────────────────────────────
  async function copyToClipboard(link: string) {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setSendSuccess("✅ Link copied to clipboard!");
    setTimeout(() => setSendSuccess(null), 3000);
  }

  // ── Poll for status ─────────────────────────────────────────────────────
  async function handlePoll() {
    if (!payment) return;
    setPolling(true);
    try {
      const res = await fetch(`/api/paynow/poll?paymentId=${payment.id}`);
      const json = await res.json();
      if (json.success && json.changed) {
        setPayment(prev => prev ? { ...prev, status: json.status } : prev);
      }
    } catch {
      // Silent fail
    } finally {
      setPolling(false);
    }
  }

  // ── Render: Existing payment (non-terminal) ─────────────────────────────
  if (payment && payment.status !== "FAILED" && payment.status !== "CANCELLED") {
    const config = STATUS_CONFIG[payment.status];
    const isPending = payment.status === "AWAITING_PAYMENT";
    const isPaid = payment.status === "PAID";

    return (
      <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-navy text-base font-semibold">Payment</h2>
          {isPending && (
            <button
              onClick={handleCancelPayment}
              disabled={cancelling}
              className="font-body text-xs text-red-500 hover:text-red-700 transition-colors"
            >
              {cancelling ? "Cancelling..." : "Cancel & retry"}
            </button>
          )}
        </div>

        {/* Status + amount */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-slate/50 text-xs uppercase tracking-wider mb-1">Amount</p>
            <p className="font-display text-navy text-2xl font-bold">
              ${payment.amount.toFixed(2)}
              <span className="font-body text-slate/40 text-sm font-normal ml-1">USD</span>
            </p>
          </div>
          <span className={`inline-block font-body font-semibold text-xs px-2.5 py-1 rounded-sm border uppercase tracking-widest ${config.classes}`}>
            {config.label}
          </span>
        </div>

        {/* Method info */}
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

        {/* Payment link - show if pending */}
        {isPending && payment.redirectUrl && (
          <div className="bg-gold-pale border border-gold/20 rounded-sm p-4 space-y-3">
            <p className="font-body text-navy text-sm font-medium">
              Payment link ready
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={payment.redirectUrl}
                className="font-mono text-xs bg-white border border-gray-200 rounded-sm px-3 py-2 flex-1 text-slate/70 truncate"
              />
              <button
                onClick={() => copyToClipboard(payment.redirectUrl!)}
                className="font-body text-xs text-navy border border-navy/20 hover:border-navy/50 px-3 py-2 rounded-sm transition-colors shrink-0"
              >
                Copy link
              </button>
            </div>
            
            {/* Send buttons for existing payment */}
            <div className="border-t border-gold/20 pt-3 mt-2">
              <p className="font-body text-navy text-xs font-medium mb-2">Send to client:</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Email button */}
                <button
                  onClick={() => sendEmailLink(payment.redirectUrl!, payment.amount)}
                  disabled={sending === "email"}
                  className="flex-1 font-body text-xs bg-navy text-white hover:bg-navy/90 px-3 py-2 rounded-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {sending === "email" ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="animate-spin">
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
                        <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>📧 Email to {clientDetails?.email?.split("@")[0] || "client"}</>
                  )}
                </button>

                {/* WhatsApp button */}
                <button
                  onClick={() => sendWhatsAppLink(payment.redirectUrl!, payment.amount)}
                  disabled={sending === "whatsapp"}
                  className="flex-1 font-body text-xs bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {sending === "whatsapp" ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="animate-spin">
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
                        <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>💬 WhatsApp to {clientDetails?.phone || "client"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {isPending && (
            <button
              onClick={handlePoll}
              disabled={polling}
              className="flex-1 font-body text-sm text-slate/60 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              {polling ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
                    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
                    <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Checking...
                </>
              ) : (
                "Check payment status"
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
            <p className="font-body text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success message */}
        {sendSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-3">
            <p className="font-body text-green-700 text-sm">{sendSuccess}</p>
          </div>
        )}

        {/* Terminal state messages */}
        {isPaid && (
          <p className="font-body text-green-700 text-sm text-center">
            ✅ Payment confirmed. Request status has been advanced to In Progress.
          </p>
        )}
      </div>
    );
  }

  // ── Render: No payment OR failed/cancelled - show initiation form ────────
  return (
    <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
      <h2 className="font-display text-navy text-base font-semibold">Initiate payment</h2>
      
      {payment?.status === "FAILED" && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-3 mb-2">
          <p className="font-body text-red-700 text-sm">⚠️ Previous payment failed. You can try again.</p>
        </div>
      )}
      
      {payment?.status === "CANCELLED" && (
        <div className="bg-gray-50 border border-gray-200 rounded-sm p-3 mb-2">
          <p className="font-body text-slate/60 text-sm">Previous payment was cancelled.</p>
        </div>
      )}

      <p className="font-body text-slate/60 text-sm leading-relaxed">
        Set the agreed amount and payment method. After creating the payment link,
        you can send it to the client with one click.
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

      {/* Phone for mobile */}
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

      {/* Success message */}
      {sendSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-3">
          <p className="font-body text-green-700 text-sm">{sendSuccess}</p>
        </div>
      )}

      {/* Submit button */}
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
            Creating payment link...
          </>
        ) : (
          "Create payment link"
        )}
      </button>

      {/* Send buttons - shown after payment is created */}
      {result?.redirectUrl && (
        <div className="border-t border-gray-100 pt-4 mt-2 space-y-3">
          <p className="font-body text-navy text-sm font-medium text-center">
            Payment link created! Send to client:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            {/* Email button */}
            {(result.clientEmail || clientDetails?.email) && (
              <button
                onClick={() => sendEmailLink(result.redirectUrl!, payment?.amount || parseFloat(amount), result.clientEmail, result.clientName)}
                disabled={sending === "email"}
                className="flex-1 font-body text-sm bg-navy text-white hover:bg-navy/90 px-4 py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending === "email" ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
                      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
                      <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>📧 Email to {(result.clientEmail || clientDetails?.email)?.split("@")[0]}</>
                )}
              </button>
            )}

            {/* WhatsApp button */}
            {(result.clientPhone || clientDetails?.phone) && (
              <button
                onClick={() => sendWhatsAppLink(result.redirectUrl!, payment?.amount || parseFloat(amount), result.clientPhone, result.clientName)}
                disabled={sending === "whatsapp"}
                className="flex-1 font-body text-sm bg-green-600 text-white hover:bg-green-700 px-4 py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending === "whatsapp" ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="animate-spin">
                      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25"/>
                      <path d="M12 7a5 5 0 00-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>💬 WhatsApp to {(result.clientPhone || clientDetails?.phone)}</>
                )}
              </button>
            )}

            {/* Copy button */}
            <button
              onClick={() => copyToClipboard(result.redirectUrl!)}
              className="flex-1 font-body text-sm text-navy border border-navy/20 hover:border-navy/50 px-4 py-2.5 rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              📋 Copy link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
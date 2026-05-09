"use client";

// components/dashboard/PaymentPanel.tsx
// Admin UI for initiating and tracking payments with one-click send to client

import { useState, useEffect } from "react";

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

const STATUS_CONFIG: Record<PaymentStatus, { label: string; classes: string }> = {
  PENDING: { label: "Pending", classes: "bg-gray-100 text-gray-500 border-gray-200" },
  AWAITING_PAYMENT: { label: "Awaiting payment", classes: "bg-amber-50 text-amber-800 border-amber-200" },
  PAID: { label: "Paid", classes: "bg-green-50 text-green-800 border-green-200" },
  FAILED: { label: "Failed", classes: "bg-red-50 text-red-700 border-red-200" },
  CANCELLED: { label: "Cancelled", classes: "bg-gray-100 text-gray-500 border-gray-200" },
};

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
  const [latestPaymentLink, setLatestPaymentLink] = useState<string | null>(null);
  const [latestAmount, setLatestAmount] = useState<number | null>(null);

  // Fetch client details
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

  // If existing payment has a redirectUrl, show it
  useEffect(() => {
    if (payment?.redirectUrl && payment.status !== "PAID") {
      setLatestPaymentLink(payment.redirectUrl);
      setLatestAmount(payment.amount);
    }
  }, [payment]);

  // Cancel payment
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
        setPayment({ ...payment, status: "CANCELLED", redirectUrl: null });
        setLatestPaymentLink(null);
        setLatestAmount(null);
      } else {
        setError(json.error ?? "Failed to cancel payment.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  // Initiate payment
  async function handleInitiate() {
    setError("");
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
      console.log("[DEBUG] Sending to Paynow:", { requestId, amount: amountNum, method });
      
      const res = await fetch("/api/paynow/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, amount: amountNum, method, phone: phone || undefined }),
      });
      const json = await res.json();
      
      console.log("[DEBUG] Paynow response:", json);

      if (!json.success) {
        setError(`Paynow Error: ${json.error || "Unknown error"}`);
        setLoading(false);
        return;
      }

      // Check if we got a redirectUrl
      if (!json.redirectUrl) {
        setError("Paynow did not return a payment link. Your account may need to be set to LIVE mode.");
        setLoading(false);
        return;
      }

      // Store the payment link
      setLatestPaymentLink(json.redirectUrl);
      setLatestAmount(amountNum);

      setPayment({
        id: json.paymentId,
        amount: amountNum,
        status: "AWAITING_PAYMENT",
        method,
        redirectUrl: json.redirectUrl,
        createdAt: new Date().toISOString(),
        paidAt: null,
      });
      
      setSendSuccess("✅ Payment link created! Use the buttons below to send to client.");
      setTimeout(() => setSendSuccess(null), 5000);
      
    } catch (err: any) {
      console.error("[DEBUG] Error:", err);
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Send email
  async function sendEmailLink() {
    if (!latestPaymentLink || !clientDetails?.email) {
      setError("No payment link or email available.");
      return;
    }
    
    setSending("email");
    setError("");
    
    try {
      const res = await fetch("/api/payments/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: clientDetails.email,
          clientName: clientDetails.name,
          amount: latestAmount,
          paymentLink: latestPaymentLink,
          requestId: requestId,
          method: "email",
        }),
      });
      const json = await res.json();
      
      if (json.success) {
        setSendSuccess(`✅ Payment link sent to ${clientDetails.email}`);
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

  // Send WhatsApp
  async function sendWhatsAppLink() {
    if (!latestPaymentLink || !clientDetails?.phone) {
      setError("No payment link or phone number available.");
      return;
    }
    
    setSending("whatsapp");
    setError("");
    
    try {
      const res = await fetch("/api/payments/send-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: clientDetails.phone,
          clientName: clientDetails.name,
          amount: latestAmount,
          paymentLink: latestPaymentLink,
          requestId: requestId,
          method: "whatsapp",
        }),
      });
      const json = await res.json();
      
      if (json.success) {
        setSendSuccess(`✅ Payment link sent via WhatsApp to ${clientDetails.phone}`);
        setTimeout(() => setSendSuccess(null), 5000);
      } else {
        setError(json.error ?? "Failed to send WhatsApp.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(null);
    }
  }

  // Copy link
  async function copyToClipboard() {
    if (!latestPaymentLink) return;
    await navigator.clipboard.writeText(latestPaymentLink);
    setSendSuccess("✅ Link copied to clipboard!");
    setTimeout(() => setSendSuccess(null), 3000);
  }

  // Poll for status
  async function handlePoll() {
    if (!payment?.id) return;
    setPolling(true);
    try {
      const res = await fetch(`/api/paynow/poll?paymentId=${payment.id}`);
      const json = await res.json();
      if (json.success && json.changed) {
        setPayment(prev => prev ? { ...prev, status: json.status } : prev);
        if (json.status === "PAID") {
          setLatestPaymentLink(null);
          setSendSuccess("✅ Payment confirmed!");
        }
      }
    } catch {
      // Silent fail
    } finally {
      setPolling(false);
    }
  }

  // Show send buttons if we have a link
  const showSendButtons = latestPaymentLink && (!payment || payment.status !== "PAID");

  // If payment exists with redirectUrl, show payment info with send buttons
  if (payment && payment.status !== "FAILED" && payment.status !== "CANCELLED" && payment.status !== "PENDING") {
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

        {/* Payment link and send buttons */}
        {isPending && payment.redirectUrl && (
          <div className="bg-gold-pale border border-gold/20 rounded-sm p-4 space-y-3">
            <p className="font-body text-navy text-sm font-medium">Payment link ready</p>
            <div className="flex items-center gap-2">
              <input readOnly value={payment.redirectUrl} className="font-mono text-xs bg-white border border-gray-200 rounded-sm px-3 py-2 flex-1 text-slate/70 truncate" />
              <button onClick={() => copyToClipboard()} className="font-body text-xs text-navy border border-navy/20 hover:border-navy/50 px-3 py-2 rounded-sm transition-colors shrink-0">Copy</button>
            </div>
            <div className="border-t border-gold/20 pt-3 mt-2">
              <p className="font-body text-navy text-xs font-medium mb-2">Send to client:</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={sendEmailLink} disabled={sending === "email"} className="flex-1 font-body text-xs bg-navy text-white hover:bg-navy/90 px-3 py-2 rounded-sm flex items-center justify-center gap-1 disabled:opacity-50">
                  {sending === "email" ? "Sending..." : `📧 Email to ${clientDetails?.email?.split("@")[0] || "client"}`}
                </button>
                <button onClick={sendWhatsAppLink} disabled={sending === "whatsapp"} className="flex-1 font-body text-xs bg-green-600 text-white hover:bg-green-700 px-3 py-2 rounded-sm flex items-center justify-center gap-1 disabled:opacity-50">
                  {sending === "whatsapp" ? "Sending..." : `💬 WhatsApp to ${clientDetails?.phone || "client"}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {isPending && (
          <button onClick={handlePoll} disabled={polling} className="w-full font-body text-sm text-slate/60 border border-gray-200 hover:border-gray-300 px-4 py-2.5 rounded-sm flex items-center justify-center gap-2">
            {polling ? "Checking..." : "Check payment status"}
          </button>
        )}

        {isPaid && <p className="font-body text-green-700 text-sm text-center">✅ Payment confirmed!</p>}
        {error && <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3"><p className="font-body text-red-700 text-sm">{error}</p></div>}
        {sendSuccess && <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-3"><p className="font-body text-green-700 text-sm">{sendSuccess}</p></div>}
      </div>
    );
  }

  // Show initiation form
  return (
    <div className="bg-white border border-gray-100 rounded-sm p-6 space-y-5">
      <h2 className="font-display text-navy text-base font-semibold">Initiate payment</h2>
      
      <p className="font-body text-slate/60 text-sm leading-relaxed">
        Set the agreed amount and payment method. After creating the payment link, you can send it to the client with one click.
      </p>

      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">Amount (USD) *</label>
        <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="font-body text-navy text-sm w-full bg-white border border-gray-200 rounded-sm px-4 py-3" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">Payment method *</label>
        <div className="grid grid-cols-3 gap-2">
          {(["web", "ecocash", "onemoney"] as const).map(m => (
            <button key={m} type="button" onClick={() => setMethod(m)} className={`font-body text-sm py-2.5 px-3 rounded-sm border capitalize ${method === m ? "bg-navy text-white border-navy" : "bg-white text-slate border-gray-200"}`}>
              {m === "web" ? "Web / Card" : m === "ecocash" ? "EcoCash" : "OneMoney"}
            </button>
          ))}
        </div>
      </div>

      {method !== "web" && (
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-navy text-sm font-medium">Client phone number *</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+263 77 123 4567" className="font-body text-navy text-sm w-full bg-white border border-gray-200 rounded-sm px-4 py-3" />
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3"><p className="font-body text-red-700 text-sm">{error}</p></div>}
      {sendSuccess && <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-3"><p className="font-body text-green-700 text-sm">{sendSuccess}</p></div>}

      <button onClick={handleInitiate} disabled={loading} className="btn-gold w-full font-body font-semibold text-navy px-4 py-3 rounded-sm text-sm tracking-wide disabled:opacity-60">
        {loading ? "Creating payment link..." : "Create payment link"}
      </button>

      {/* Show send buttons immediately after creation */}
      {showSendButtons && (
        <div className="border-t border-gray-100 pt-4 mt-2 space-y-3">
          <p className="font-body text-navy text-sm font-medium text-center">✅ Payment link created! Send to client:</p>
          <div className="flex items-center gap-2">
            <input readOnly value={latestPaymentLink || ""} className="font-mono text-xs bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 flex-1 truncate" />
            <button onClick={copyToClipboard} className="font-body text-xs text-navy border border-navy/20 hover:border-navy/50 px-3 py-2 rounded-sm">Copy</button>
          </div>
          <button onClick={sendEmailLink} disabled={sending === "email"} className="w-full font-body text-sm bg-navy text-white hover:bg-navy/90 px-4 py-2.5 rounded-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {sending === "email" ? "Sending..." : `📧 Email to ${clientDetails?.email || "client"}`}
          </button>
          <button onClick={sendWhatsAppLink} disabled={sending === "whatsapp"} className="w-full font-body text-sm bg-green-600 text-white hover:bg-green-700 px-4 py-2.5 rounded-sm flex items-center justify-center gap-2 disabled:opacity-50">
            {sending === "whatsapp" ? "Sending..." : `💬 WhatsApp to ${clientDetails?.phone || "client"}`}
          </button>
        </div>
      )}
    </div>
  );
}
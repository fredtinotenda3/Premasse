// app/(public)/payment/complete/page.tsx
// Client lands here after completing (or cancelling) payment on Paynow's site.
// Reads the `ref` query param (our requestId), polls for the latest status,
// and shows a friendly confirmation or failure message.

import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Payment — Premasse Business Services",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PaymentCompletePage({
  searchParams,
}: {
  searchParams: { ref?: string };
}) {
  const requestId = searchParams.ref;

  // Load the most recent payment for this request
  const payment = requestId
    ? await prisma.payment.findFirst({
        where:   { requestId },
        orderBy: { createdAt: "desc" },
        select:  {
          status:  true,
          amount:  true,
          method:  true,
          paidAt:  true,
        },
      })
    : null;

  const isPaid      = payment?.status === "PAID";
  const isCancelled = payment?.status === "CANCELLED";
  const isFailed    = payment?.status === "FAILED";
  const isPending   = payment?.status === "AWAITING_PAYMENT" || !payment;

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen pt-20">
        <div className="bg-navy py-16 px-6">
          <div className="mx-auto max-w-xl text-center">
            <span className="font-display text-white text-3xl">
              {isPaid ? "Payment confirmed" :
               isCancelled ? "Payment cancelled" :
               isFailed ? "Payment failed" :
               "Payment processing"}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-xl px-6 py-16">
          <div className="bg-white border border-gray-100 rounded-sm p-10 text-center">

            {/* Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isPaid      ? "bg-green-50 border border-green-200" :
              isCancelled ? "bg-gray-100 border border-gray-200" :
              isFailed    ? "bg-red-50 border border-red-200" :
                            "bg-amber-50 border border-amber-200"
            }`}>
              {isPaid ? (
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" className="text-green-600">
                  <path d="M4 13l6 6L22 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : isCancelled || isFailed ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-gray-400">
                  <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-amber-600 animate-spin">
                  <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
                  <path d="M20 11a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </div>

            {/* Message */}
            {isPaid && (
              <>
                <h2 className="font-display text-navy text-2xl font-semibold mb-3">Thank you</h2>
                <p className="font-body text-slate leading-relaxed mb-2">
                  Your payment of <strong>${payment!.amount.toFixed(2)} USD</strong> has been received.
                </p>
                <p className="font-body text-slate/70 text-sm leading-relaxed">
                  Our team will now begin processing your request. You&apos;ll hear from us shortly.
                </p>
              </>
            )}

            {isCancelled && (
              <>
                <h2 className="font-display text-navy text-2xl font-semibold mb-3">Payment cancelled</h2>
                <p className="font-body text-slate leading-relaxed">
                  Your payment was cancelled. Your request is still on file — contact us if you&apos;d like to proceed.
                </p>
              </>
            )}

            {isFailed && (
              <>
                <h2 className="font-display text-navy text-2xl font-semibold mb-3">Payment unsuccessful</h2>
                <p className="font-body text-slate leading-relaxed">
                  Something went wrong with the payment. Please contact us and we&apos;ll send you a new payment link.
                </p>
              </>
            )}

            {isPending && (
              <>
                <h2 className="font-display text-navy text-2xl font-semibold mb-3">Processing…</h2>
                <p className="font-body text-slate leading-relaxed">
                  We&apos;re waiting for confirmation from Paynow. This page will update automatically — or check your email.
                </p>
              </>
            )}

            {/* Reference */}
            {requestId && (
              <p className="font-body text-slate/40 text-xs mt-6">
                Reference: <span className="font-mono">{requestId}</span>
              </p>
            )}

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="font-body text-navy border border-navy/25 hover:border-navy px-6 py-2.5 rounded-sm text-sm transition-colors"
              >
                Back to home
              </Link>
              <Link
                href="/contact"
                className="btn-gold font-body font-semibold text-navy px-6 py-2.5 rounded-sm text-sm"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

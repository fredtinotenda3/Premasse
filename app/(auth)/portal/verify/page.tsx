// app/(auth)/portal/verify/page.tsx
// Shown after client requests a magic link.
// Simple confirmation — tells them to check their email.

import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div className="relative w-full max-w-sm text-center">
        <div className="text-center mb-10">
          <span className="font-display text-2xl font-bold text-white tracking-wide block">
            Premasse
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-body font-medium">
            Client portal
          </span>
        </div>

        <div className="bg-white rounded-sm p-10">
          {/* Envelope icon */}
          <div className="w-14 h-14 rounded-full bg-gold-pale border border-gold/20 flex items-center justify-center mx-auto mb-6">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-gold">
              <rect x="2" y="5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M2 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h1 className="font-display text-navy text-xl font-semibold mb-3">
            Check your email
          </h1>
          <p className="font-body text-slate text-sm leading-relaxed mb-6">
            We&apos;ve sent a sign-in link to your email address. Click the link in
            the email to sign in — it expires in 24 hours.
          </p>
          <p className="font-body text-slate/50 text-xs">
            Didn&apos;t receive it? Check your spam folder, or{" "}
            <Link href="/portal/login" className="text-navy underline underline-offset-2">
              try again
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

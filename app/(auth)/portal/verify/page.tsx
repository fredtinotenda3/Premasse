// app/(auth)/portal/verify/page.tsx
// Premium cinematic verify-email confirmation page.

import Link from "next/link";

import {
  ArrowRight,
  MailCheck,
  Sparkles,
} from "lucide-react";

export default function VerifyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#041f19] flex items-center justify-center px-6 py-10">

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-180px] left-[-120px] w-[420px] h-[420px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

        <div className="absolute bottom-[-200px] right-[-120px] w-[460px] h-[460px] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.08),transparent_28%)]" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#041f19] via-[#041f19]/96 to-black" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-3 mb-5">

            <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

              <Sparkles className="w-4 h-4 text-[#C9A84C]" />

              <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
                Client portal
              </span>
            </div>
          </div>

          <h1 className="font-display text-white text-4xl font-bold tracking-wide mb-2">
            Premasse
          </h1>

          <p className="text-white/45 text-sm">
            Secure client access
          </p>
        </div>

        {/* Main card */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            p-10
            shadow-[0_40px_120px_rgba(0,0,0,0.28)]
          "
        >

          {/* Glow */}
          <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

          <div className="relative">

            {/* Icon */}
            <div className="w-20 h-20 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(201,168,76,0.15)]">

              <MailCheck className="w-9 h-9 text-[#C9A84C]" />
            </div>

            {/* Heading */}
            <h2 className="font-display text-white text-3xl text-center mb-4">
              Check your email
            </h2>

            {/* Description */}
            <p className="text-white/65 text-sm leading-relaxed text-center mb-8">
              We&apos;ve sent a secure sign-in link to your email address.
              Open the email and click the link to access your client portal.
            </p>

            {/* Info box */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 mb-8">

              <div className="flex items-start gap-3">

                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0">

                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-[#C9A84C]"
                  >
                    <path
                      d="M8 5.333v2.334M8 10h.007"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>

                <div>

                  <p className="text-white text-sm font-medium mb-1">
                    Link expires in 24 hours
                  </p>

                  <p className="text-white/45 text-xs leading-relaxed">
                    If you don&apos;t see the email, check your spam or junk folder.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/portal/login"
              className="
                group
                inline-flex
                items-center
                justify-center
                gap-2
                w-full
                rounded-2xl
                border
                border-[#C9A84C]/20
                bg-[#C9A84C]/10
                px-6
                py-4
                text-[#C9A84C]
                text-sm
                font-semibold
                tracking-[0.14em]
                uppercase
                hover:bg-[#C9A84C]/15
                transition-all
                duration-300
              "
            >

              Try again

              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
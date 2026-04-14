// app/(auth)/portal/login/page.tsx

import { Metadata }     from "next";
import Link             from "next/link";
import { redirect }     from "next/navigation";
import { signIn, auth } from "@/auth";

export const metadata: Metadata = {
  title: "Sign in — Premasse Portal",
  robots: { index: false, follow: false },
};

const ERROR_MESSAGES: Record<string, string> = {
  Verification:       "This sign-in link has expired or already been used. Request a new one.",
  EmailCreateAccount: "No account found for this email. Please register first.",
  default:            "Something went wrong. Please try again.",
};

async function sendMagicLink(formData: FormData) {
  "use server";
  const email       = formData.get("email") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/portal";

  try {
    await signIn("email", { email, redirectTo: callbackUrl });
  } catch (error: any) {
    if (error?.message === "NEXT_REDIRECT") throw error;
    redirect(`/portal/login?error=default`);
  }
}

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; registered?: string; callbackUrl?: string }>;
}) {
  const { error, registered, callbackUrl } = await searchParams;

  const session = await auth();
  if (session?.user?.role === "CLIENT") {
    redirect(callbackUrl ?? "/portal");
  }

  const errorMsg = error
    ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.default)
    : null;

  const justRegistered = registered === "1";

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="font-display text-2xl font-bold text-white tracking-wide block">
            Premasse
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-body font-medium">
            Client portal
          </span>
        </div>

        <div className="bg-white rounded-sm p-8">
          <h1 className="font-display text-navy text-xl font-semibold mb-1">
            Sign in
          </h1>
          <p className="font-body text-slate text-sm mb-7">
            Enter your email and we&apos;ll send you a sign-in link.
          </p>

          {/* Just registered banner */}
          {justRegistered && (
            <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-3 mb-5 flex gap-2 items-start">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-green-600 shrink-0 mt-0.5">
                <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="font-body text-green-800 text-sm">
                Account created. Enter your email to sign in.
              </p>
            </div>
          )}

          {/* Error banner */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-5 flex gap-2 items-start">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-500 shrink-0 mt-0.5">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 4v3M7 9.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="font-body text-red-700 text-sm">{errorMsg}</p>
            </div>
          )}

          <form action={sendMagicLink} className="space-y-4">
            <input
              type="hidden"
              name="callbackUrl"
              value={callbackUrl ?? "/portal"}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-body text-navy text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="font-body text-navy text-sm w-full bg-white border border-gray-200 rounded-sm px-4 py-3 placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
              />
            </div>

            <button
              type="submit"
              className="btn-gold w-full font-body font-semibold text-navy px-8 py-3.5 rounded-sm text-sm tracking-wide"
            >
              Send sign-in link
            </button>
          </form>

          <p className="font-body text-slate/50 text-xs text-center mt-5">
            Don't have an account?{" "}
            <Link href="/portal/register" className="text-navy underline underline-offset-2">
              Register
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="font-body text-white/35 text-xs hover:text-white/60 transition-colors">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

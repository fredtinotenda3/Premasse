// app/(auth)/login/page.tsx

import { Metadata }  from "next";
import { redirect }  from "next/navigation";
import { AuthError } from "next-auth";
import { signIn, auth } from "@/auth";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

async function loginAction(formData: FormData) {
  "use server";

  const email       = formData.get("email")       as string;
  const password    = formData.get("password")    as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          redirect(`/login?error=invalid_credentials`);
        default:
          redirect(`/login?error=unknown`);
      }
    }
    throw error;
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials:   "Incorrect email or password. Please try again.",
  unknown:               "Something went wrong. Please try again.",
  OAuthAccountNotLinked: "This email is linked to a different sign-in method.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const { error, callbackUrl } = await searchParams;

  // If already logged in, skip the login page
  const session = await auth();
  if (session?.user) {
    redirect(callbackUrl ?? "/dashboard");
  }

  const errorMessage = error
    ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.unknown)
    : null;

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-6">

      {/* Background grid texture */}
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
            Business Services
          </span>
        </div>

        {/* Card */}
        <div className="bg-white rounded-sm p-8">
          <h1 className="font-display text-navy text-xl font-semibold mb-1">
            Admin login
          </h1>
          <p className="font-body text-slate text-sm mb-7">
            Sign in to access the dashboard.
          </p>

          {/* Error banner */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-6 flex gap-2 items-start">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                className="text-red-500 shrink-0 mt-0.5"
              >
                <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7.5 4.5v3M7.5 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="font-body text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Form */}
          <form action={loginAction} className="space-y-5">
            <input
              type="hidden"
              name="callbackUrl"
              value={callbackUrl ?? "/dashboard"}
            />

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-body text-navy text-sm font-medium"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@premasse.co.zw"
                className="font-body text-navy text-sm w-full bg-white border border-gray-200 rounded-sm px-4 py-3 placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="font-body text-navy text-sm font-medium"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="font-body text-navy text-sm w-full bg-white border border-gray-200 rounded-sm px-4 py-3 placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-gold/20 focus:border-gold transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-gold w-full font-body font-semibold text-navy px-8 py-3.5 rounded-sm text-sm tracking-wide mt-2"
            >
              Sign in
            </button>
          </form>
        </div>

        {/* Back to site */}
        <p className="text-center mt-6">
          <Link
            href="/"
            className="font-body text-white/40 text-xs hover:text-white/70 transition-colors"
          >
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

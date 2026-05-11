// app/(auth)/login/page.tsx

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthError } from "next-auth";

import {
  signIn,
  auth,
} from "@/auth";

import Link from "next/link";

import {
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata =
  {
    title:
      "Admin Login",

    robots: {
      index: false,
      follow: false,
    },
  };

// ─────────────────────────────────────────────────────────────
// Login action
// ─────────────────────────────────────────────────────────────

async function loginAction(
  formData: FormData
) {
  "use server";

  const email =
    formData.get(
      "email"
    ) as string;

  const password =
    formData.get(
      "password"
    ) as string;

  const callbackUrl =
    (formData.get(
      "callbackUrl"
    ) as string) ||
    "/dashboard";

  try {
    await signIn(
      "credentials",
      {
        email,
        password,
        redirectTo:
          callbackUrl,
      }
    );
  } catch (error) {
    if (
      error instanceof
      AuthError
    ) {
      switch (
        error.type
      ) {
        case "CredentialsSignin":
          redirect(
            `/login?error=invalid_credentials`
          );

        default:
          redirect(
            `/login?error=unknown`
          );
      }
    }

    throw error;
  }
}

// ─────────────────────────────────────────────────────────────
// Errors
// ─────────────────────────────────────────────────────────────

const ERROR_MESSAGES: Record<
  string,
  string
> = {
  invalid_credentials:
    "Incorrect email or password. Please try again.",

  unknown:
    "Something went wrong. Please try again.",

  OAuthAccountNotLinked:
    "This email is linked to a different sign-in method.",
};

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    callbackUrl?: string;
  }>;
}) {
  const {
    error,
    callbackUrl,
  } =
    await searchParams;

  // Already logged in
  const session =
    await auth();

  if (session?.user) {
    redirect(
      callbackUrl ??
        "/dashboard"
    );
  }

  const errorMessage =
    error
      ? ERROR_MESSAGES[
          error
        ] ??
        ERROR_MESSAGES.unknown
      : null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#041f19] flex items-center justify-center px-6 py-10">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-180px] left-[-120px] w-[420px] h-[420px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

        <div className="absolute bottom-[-220px] right-[-120px] w-[480px] h-[480px] rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,76,0.08),transparent_28%)]" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#041f19] via-[#041f19]/96 to-black" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",

            backgroundSize:
              "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-3 mb-5">

            <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

              <Sparkles className="w-4 h-4 text-[#C9A84C]" />

              <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
                Secure access
              </span>
            </div>
          </div>

          <h1 className="font-display text-white text-5xl font-bold tracking-wide mb-2">
            Premasse
          </h1>

          <p className="text-white/45 text-sm">
            Business Services
          </p>
        </div>

        {/* Card */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            p-8 sm:p-10
            shadow-[0_40px_120px_rgba(0,0,0,0.28)]
          "
        >

          {/* Glow */}
          <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

          <div className="relative">

            {/* Icon */}
            <div className="w-20 h-20 rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(201,168,76,0.15)]">

              <ShieldCheck className="w-9 h-9 text-[#C9A84C]" />
            </div>

            {/* Heading */}
            <h2 className="font-display text-white text-3xl text-center mb-3">
              Admin login
            </h2>

            <p className="text-white/55 text-sm text-center leading-relaxed mb-8">
              Sign in to access
              the Premasse
              administration
              dashboard.
            </p>

            {/* Error */}
            {errorMessage && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 mb-7 flex gap-3 items-start">

                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">

                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    className="text-red-300"
                  >
                    <circle
                      cx="7.5"
                      cy="7.5"
                      r="6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M7.5 4.5v3M7.5 10h.01"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <p className="text-red-200 text-sm leading-relaxed">
                  {
                    errorMessage
                  }
                </p>
              </div>
            )}

            {/* Form */}
            <form
              action={
                loginAction
              }
              className="space-y-5"
            >

              <input
                type="hidden"
                name="callbackUrl"
                value={
                  callbackUrl ??
                  "/dashboard"
                }
              />

              {/* Email */}
              <div className="flex flex-col gap-2">

                <label
                  htmlFor="email"
                  className="text-white text-sm font-medium"
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
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    px-5
                    py-4
                    text-white
                    text-sm
                    placeholder:text-white/30
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#C9A84C]/20
                    focus:border-[#C9A84C]/30
                    transition-all
                  "
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">

                <label
                  htmlFor="password"
                  className="text-white text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative">

                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      px-5
                      py-4
                      pr-14
                      text-white
                      text-sm
                      placeholder:text-white/30
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[#C9A84C]/20
                      focus:border-[#C9A84C]/30
                      transition-all
                    "
                  />

                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30">

                    <LockKeyhole className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="
                  group
                  w-full
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-[#C9A84C]/20
                  bg-[#C9A84C]/10
                  px-6
                  py-4
                  text-[#C9A84C]
                  text-sm
                  font-semibold
                  tracking-[0.16em]
                  uppercase
                  hover:bg-[#C9A84C]/15
                  transition-all
                  duration-300
                  mt-2
                "
              >

                Sign in

                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>

        {/* Back */}
        <div className="text-center mt-7">

          <Link
            href="/"
            className="text-white/35 text-xs hover:text-white/65 transition-colors duration-300"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
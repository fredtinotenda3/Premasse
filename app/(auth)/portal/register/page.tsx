"use client";

// app/(auth)/portal/register/page.tsx
// Client self-registration form.
// On success, redirects to /portal/login with a ?registered=1 param
// so the login page can show a "check your email" nudge.

import { useState } from "react";
import Link         from "next/link";
import { useRouter } from "next/navigation";
import { useForm }  from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z }        from "zod";

const schema = z.object({
  name:  z.string().min(2, "Enter your full name").trim(),
  email: z.string().email("Enter a valid email address").trim(),
  phone: z
    .string()
    .regex(/^(\+263|0)[0-9]{9}$/, "Enter a valid Zimbabwean number")
    .optional()
    .or(z.literal("")),
});

type Fields = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({ resolver: zodResolver(schema) });

  async function onSubmit(data: Fields) {
    setServerError("");
    const res  = await fetch("/api/portal/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) {
      setServerError(json.error ?? "Registration failed.");
      return;
    }
    router.push("/portal/login?registered=1");
  }

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
            Create an account
          </h1>
          <p className="font-body text-slate text-sm mb-7">
            Track your service requests online.
          </p>

          {serverError && (
            <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-5 flex gap-2 items-start">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 4v3M7 9.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p className="font-body text-red-700 text-sm">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-navy text-sm font-medium">
                Full name <span className="text-gold">*</span>
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="Tatenda Moyo"
                autoComplete="name"
                className={inputCls(!!errors.name)}
              />
              {errors.name && (
                <p className="font-body text-red-600 text-xs">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-navy text-sm font-medium">
                Email address <span className="text-gold">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={inputCls(!!errors.email)}
              />
              {errors.email && (
                <p className="font-body text-red-600 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-navy text-sm font-medium">
                Phone number
                <span className="font-normal text-slate/40 ml-1">(optional)</span>
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+263 77 123 4567"
                autoComplete="tel"
                className={inputCls(!!errors.phone)}
              />
              {errors.phone && (
                <p className="font-body text-red-600 text-xs">{errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full font-body font-semibold text-navy px-8 py-3.5 rounded-sm text-sm tracking-wide disabled:opacity-60 mt-2"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="font-body text-slate/50 text-xs text-center mt-5">
            Already have an account?{" "}
            <Link href="/portal/login" className="text-navy underline underline-offset-2">
              Sign in
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

function inputCls(err: boolean) {
  return [
    "font-body text-navy text-sm w-full bg-white border rounded-sm px-4 py-3",
    "placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors",
    err
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-gold focus:ring-gold/20",
  ].join(" ");
}

// app/(public)/contact/page.tsx
// Contact page — contact form + direct contact details.
// Form submits to /api/contact (to be wired up with Resend in Phase 3+).

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ── Validation schema ─────────────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name").max(100).trim(),
  email: z.string().email("Enter a valid email address").trim().toLowerCase(),
  phone: z
    .string()
    .regex(/^(\+263|0)[0-9]{9}$/, "Enter a valid Zimbabwean number")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(3, "Enter a subject").max(150).trim(),
  message: z.string().min(10, "Please write a message").max(2000).trim(),
});

type ContactFields = z.infer<typeof contactSchema>;

// ── Contact details ───────────────────────────────────────────────────────────

const CONTACT_ITEMS = [
  {
    label: "Email",
    value: "info@premasse.co.zw",
    href: "mailto:info@premasse.co.zw",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2 7l7 5 7-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Location",
    value: "Harare, Zimbabwe",
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2a5 5 0 015 5c0 3.5-5 9-5 9S4 10.5 4 7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.3"/>
        <circle cx="9" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: "Hours",
    value: "Mon – Fri, 8:00 AM – 5:00 PM CAT",
    href: null,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFields>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactFields) {
    setServerMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!json.success) {
        setServerMessage(json.error ?? "Something went wrong. Please try again.");
        setSubmitState("error");
        return;
      }

      setSubmitState("success");
      reset();
    } catch {
      setServerMessage("A network error occurred. Please try again.");
      setSubmitState("error");
    }
  }

  return (
    <>
      <main>
        {/* Hero with image - matching homepage style */}
        <section className="relative min-h-[70vh] bg-navy overflow-hidden flex items-center">
          {/* Architectural grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Hero image — right-side bleed, professional customer support context */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=85&auto=format&fit=crop"
              alt="Customer support professional"
              fill
              className="object-cover object-center"
              style={{ opacity: 1 }}
              sizes="50vw"
              priority
            />
            {/* Navy fade from left */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, #0A2540 0%, #0A2540 20%, rgba(10,37,64,0.7) 55%, rgba(10,37,64,0.15) 100%)",
              }}
            />
            {/* Navy fade from bottom */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, #0A2540 0%, transparent 40%)",
              }}
            />
          </div>

          {/* Diagonal gold accent */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(135deg, transparent 58%, rgba(201,168,76,0.03) 58%, rgba(201,168,76,0.03) 72%, transparent 72%)",
            }}
          />

          {/* Top gold rule */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gold opacity-20" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-12 pt-36 pb-28 w-full">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-10 bg-gold" />
                <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
                  Get in touch
                </span>
              </div>

              <h1
                className="font-display text-white leading-[1.08] mb-6"
                style={{
                  fontSize: "clamp(3rem, 5.5vw, 5.2rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                Contact us
              </h1>

              <p
                className="font-body text-white/60 leading-relaxed"
                style={{
                  fontSize: "1.125rem",
                  maxWidth: "560px",
                }}
              >
                Have a question before submitting a request? Send us a message
                and we&apos;ll get back to you within one business day.
              </p>
            </div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(10,37,64,0.8))",
            }}
            aria-hidden="true"
          />
        </section>

        {/* Content */}
        <div className="bg-cream py-20 px-6">
          <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Contact form — 2/3 */}
            <div className="md:col-span-2">
              <div className="bg-white border border-gray-100 rounded-sm p-8">

                {/* Success state */}
                {submitState === "success" ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h2 className="font-display text-navy text-2xl font-semibold mb-3">
                      Message sent
                    </h2>
                    <p className="font-body text-slate text-base leading-relaxed mb-8 max-w-sm mx-auto">
                      Thanks for reaching out. We&apos;ll get back to you within one business day.
                    </p>
                    <button
                      onClick={() => setSubmitState("idle")}
                      className="font-body text-navy border border-navy/25 hover:border-navy px-6 py-2.5 rounded-sm text-sm transition-colors"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-navy text-xl font-semibold mb-2">
                      Send a message
                    </h2>
                    <p className="font-body text-slate/60 text-sm mb-8">
                      Fields marked <span className="text-gold">*</span> are required.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

                      {/* Name + Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Full name" error={errors.name?.message} required>
                          <input
                            {...register("name")}
                            type="text"
                            placeholder="Tatenda Moyo"
                            autoComplete="name"
                            className={inputCls(!!errors.name)}
                          />
                        </Field>
                        <Field label="Email address" error={errors.email?.message} required>
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            className={inputCls(!!errors.email)}
                          />
                        </Field>
                      </div>

                      {/* Phone */}
                      <Field
                        label="Phone number"
                        error={errors.phone?.message}
                        hint="Optional — Zimbabwean numbers only"
                      >
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="+263 77 123 4567"
                          autoComplete="tel"
                          className={inputCls(!!errors.phone)}
                        />
                      </Field>

                      {/* Subject */}
                      <Field label="Subject" error={errors.subject?.message} required>
                        <input
                          {...register("subject")}
                          type="text"
                          placeholder="e.g. Question about company registration"
                          className={inputCls(!!errors.subject)}
                        />
                      </Field>

                      {/* Message */}
                      <Field label="Message" error={errors.message?.message} required>
                        <textarea
                          {...register("message")}
                          rows={5}
                          placeholder="Write your message here…"
                          className={`${inputCls(!!errors.message)} resize-none`}
                        />
                      </Field>

                      {/* Server error */}
                      {submitState === "error" && serverMessage && (
                        <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 flex gap-2 items-start">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-500 shrink-0 mt-0.5">
                            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M7 4v3M7 9.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          <p className="font-body text-red-700 text-sm">{serverMessage}</p>
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-gold w-full font-body font-semibold text-navy px-8 py-4 rounded-sm text-base tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
                              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
                              <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Sending…
                          </>
                        ) : (
                          "Send message"
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar — 1/3 */}
            <aside className="space-y-6">

              {/* Contact details */}
              <div className="bg-white border border-gray-100 rounded-sm p-6">
                <h3 className="font-display text-navy text-base font-semibold mb-5">
                  Contact details
                </h3>
                <ul className="space-y-5">
                  {CONTACT_ITEMS.map(({ label, value, href, icon }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="text-gold shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="font-body text-slate/40 text-xs uppercase tracking-wider mb-0.5">
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            className="font-body text-navy text-sm hover:underline underline-offset-2 decoration-gold transition-all"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="font-body text-navy text-sm">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prefer a service request? */}
              <div className="bg-gold-pale border border-gold/20 rounded-sm p-6">
                <h3 className="font-display text-navy text-base font-semibold mb-2">
                  Ready to proceed?
                </h3>
                <p className="font-body text-slate text-sm leading-relaxed mb-4">
                  If you know which service you need, skip the message and submit a request directly.
                </p>
                <Link
                  href="/request"
                  className="btn-gold block w-full font-body font-semibold text-navy px-5 py-3 rounded-sm text-sm tracking-wide text-center"
                >
                  Request a service
                </Link>
              </div>

              {/* Response time note */}
              <div className="bg-white border border-gray-100 rounded-sm p-6">
                <h3 className="font-display text-navy text-base font-semibold mb-3">
                  Response time
                </h3>
                <p className="font-body text-slate/70 text-sm leading-relaxed">
                  We respond to all enquiries within{" "}
                  <span className="font-medium text-navy">one business day</span>.
                  For urgent matters, email us directly at{" "}
                  <a
                    href="mailto:info@premasse.co.zw"
                    className="text-navy underline underline-offset-2 decoration-gold hover:decoration-2 transition-all"
                  >
                    info@premasse.co.zw
                  </a>
                  .
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-navy text-sm font-medium">
        {label}
        {required && (
          <span className="text-gold ml-1" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="font-body text-slate/50 text-xs">{hint}</p>
      )}
      {error && (
        <p className="font-body text-red-600 text-xs" role="alert">{error}</p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean): string {
  return [
    "font-body text-navy text-sm w-full bg-white border rounded-sm px-4 py-3",
    "placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-gold focus:ring-gold/20",
  ].join(" ");
}
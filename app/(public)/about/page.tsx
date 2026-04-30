// app/(public)/about/page.tsx
// About page — who Premasse is, what they stand for, and why clients trust them.

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description:
    "Premasse Business Services is a registered tax and business services firm based in Harare, Zimbabwe, serving SMEs and individuals across the country.",
};

const VALUES = [
  {
    title: "Registered practitioners",
    body: "All our accountants are registered with the Public Accountants and Auditors Board (PAAB) of Zimbabwe. You deal with qualified professionals, not junior staff.",
  },
  {
    title: "Local expertise",
    body: "We understand Zimbabwe's tax legislation, ZIMRA processes, and the Companies and Other Business Entities Act inside and out. No guesswork.",
  },
  {
    title: "Transparent fees",
    body: "We agree fees upfront before any work begins. No hourly rate surprises, no hidden costs. SME-friendly pricing that reflects the reality of running a business in Zimbabwe.",
  },
  {
    title: "End-to-end handling",
    body: "We don't hand you a form and wish you luck. We prepare, submit, and follow up with ZIMRA and relevant authorities until the job is fully done.",
  },
];

const SERVICES_SUMMARY = [
  "Registered Tax Accountant Consultations",
  "Company Registration",
  "ZIMRA / Tax Registration",
  "Tax Clearance Certificates (ITF263)",
  "Accounting Services for SMEs",
];

export default function AboutPage() {
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

          {/* Hero image — right-side bleed, professional African business context */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85&auto=format&fit=crop"
              alt="Professional team meeting"
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
                  Who we are
                </span>
              </div>
              <h1
                className="font-display text-white leading-[1.08] mb-6"
                style={{
                  fontSize: "clamp(3rem, 5.5vw, 5.2rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                A firm built for{" "}
                <em className="text-gold not-italic">Zimbabwean business.</em>
              </h1>
              <p
                className="font-body text-white/60 leading-relaxed"
                style={{
                  fontSize: "1.125rem",
                  maxWidth: "560px",
                }}
              >
                Premasse Business Services is a registered tax and business
                services firm based in Harare. We help SMEs and individuals stay
                compliant, get registered, and focus on growing their businesses
                rather than chasing paperwork.
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

        {/* Mission section */}
        <div className="bg-cream py-24 px-6">
          <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold" />
                <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">
                  Our mission
                </span>
              </div>
              <h2 className="font-display text-navy text-3xl md:text-4xl leading-tight mb-6">
                Compliance shouldn&apos;t be a full-time job.
              </h2>
              <p className="font-body text-slate text-base leading-relaxed mb-4">
                Too many Zimbabwean business owners spend hours navigating ZIMRA
                portals, chasing ITF263 certificates, and trying to decode the
                Companies Act — time that should be spent running their business.
              </p>
              <p className="font-body text-slate text-base leading-relaxed">
                Premasse exists to take that burden off your desk entirely. We
                handle the tax registrations, clearances, and accounting so you
                can concentrate on what you&apos;re actually good at.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold" />
                <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">
                  Services
                </span>
              </div>
              <ul className="space-y-3">
                {SERVICES_SUMMARY.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                    <span className="font-body text-slate text-base">{s}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <Link
                  href="/services"
                  className="font-body text-navy text-sm underline underline-offset-2 decoration-gold hover:decoration-2 transition-all"
                >
                  View all services →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Values section */}
        <div className="bg-navy py-24 px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-14">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-gold" />
                <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">
                  How we work
                </span>
              </div>
              <h2 className="font-display text-white text-3xl md:text-4xl leading-tight">
                What you can expect from us.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
              {VALUES.map((v, i) => (
                <div
                  key={v.title}
                  className="bg-navy hover:bg-navy-light transition-colors duration-300 p-8"
                >
                  <span className="font-display text-4xl text-gold/20 font-bold block mb-5 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-white text-lg font-semibold mb-3">
                    {v.title}
                  </h3>
                  <p className="font-body text-white/55 text-sm leading-relaxed">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Location + contact strip */}
        <div className="bg-gold-pale border-t border-gold/20 py-16 px-6">
          <div className="mx-auto max-w-4xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-gold" />
                <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">
                  Find us
                </span>
              </div>
              <p className="font-display text-navy text-2xl font-semibold mb-1">
                Based in Harare, Zimbabwe.
              </p>
              <p className="font-body text-slate text-base">
                Serving clients across Zimbabwe.
              </p>
              <a
                href="mailto:info@premasse.co.zw"
                className="font-body text-navy text-sm underline underline-offset-2 decoration-gold hover:decoration-2 transition-all mt-3 inline-block"
              >
                info@premasse.co.zw
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
              <Link
                href="/request"
                className="btn-gold font-body font-semibold text-navy px-8 py-4 rounded-sm text-base tracking-wide text-center"
              >
                Request a service
              </Link>
              <Link
                href="/contact"
                className="font-body text-navy border border-navy/25 hover:border-navy px-8 py-4 rounded-sm text-base tracking-wide text-center transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
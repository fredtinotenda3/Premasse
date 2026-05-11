// app/(public)/services/[slug]/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceCategory } from "@prisma/client";
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

// ─────────────────────────────────────────────────────────────
// Dynamic Images (LOCAL ASSETS)
// ─────────────────────────────────────────────────────────────

const CATEGORY_IMAGES: Record<ServiceCategory, string> = {
  TAX_ACCOUNTING:
    "/images/services/tax-accounting.png",

  COMPANY_REG:
    "/images/services/company-registration.png",

  ZIMRA_TAX_REG:
    "/images/services/zimra-registration.png",

  TAX_CLEARANCE:
    "/images/services/tax-clearance.png",

  SME_ACCOUNTING:
    "/images/services/accounting.png",

  STOCK_TAKING:
    "/images/services/stock-taking.png",

  COMPLIANCE:
    "/images/services/compliance.png",

  BUSINESS_ACUMEN:
    "/images/services/business-acumen.png",
};

// ─────────────────────────────────────────────────────────────
// SEO CONFIG
// ─────────────────────────────────────────────────────────────

const SEO_CONFIG: Record<
  ServiceCategory,
  {
    titleKeyword: string;
    metaDescription: string;
    h1: string;
    keywords: string[];
  }
> = {
  TAX_CLEARANCE: {
    titleKeyword:
      "ITF263 Tax Clearance Certificate Zimbabwe",
    metaDescription:
      "Get your ZIMRA ITF263 Tax Clearance Certificate in Zimbabwe fast.",
    h1:
      "Tax Clearance Certificate (ITF263) Zimbabwe",
    keywords: ["tax clearance Zimbabwe"],
  },

  COMPANY_REG: {
    titleKeyword:
      "Company Registration Zimbabwe",
    metaDescription:
      "Register your company in Zimbabwe professionally.",
    h1:
      "Company Registration Zimbabwe",
    keywords: ["company registration Zimbabwe"],
  },

  ZIMRA_TAX_REG: {
    titleKeyword:
      "ZIMRA Tax Registration Zimbabwe",
    metaDescription:
      "Professional ZIMRA tax registration services in Zimbabwe.",
    h1:
      "ZIMRA Tax Registration Zimbabwe",
    keywords: ["ZIMRA registration Zimbabwe"],
  },

  TAX_ACCOUNTING: {
    titleKeyword:
      "Registered ZIMRA Tax Accountant Consultation Zimbabwe",
    metaDescription:
      "Professional tax consultations with ZIMRA-registered practitioners.",
    h1:
      "Registered ZIMRA Tax Accountant Consultation Zimbabwe",
    keywords: ["tax accountant Zimbabwe"],
  },

  SME_ACCOUNTING: {
    titleKeyword:
      "SME Accounting & Bookkeeping Services Zimbabwe",
    metaDescription:
      "Professional SME accounting and bookkeeping services.",
    h1:
      "SME Accounting & Bookkeeping Services Zimbabwe",
    keywords: ["SME accounting Zimbabwe"],
  },

  STOCK_TAKING: {
    titleKeyword:
      "Physical Stock-Taking & Inventory Services Zimbabwe",
    metaDescription:
      "Professional stock-taking and inventory audit services.",
    h1:
      "Physical Stock-Taking & Inventory Services Zimbabwe",
    keywords: ["stock taking Zimbabwe"],
  },

  COMPLIANCE: {
    titleKeyword:
      "NSSA, PRAZ & ZIMDEF Compliance Services Zimbabwe",
    metaDescription:
      "Professional statutory compliance services.",
    h1:
      "Statutory Compliance Services Zimbabwe",
    keywords: ["NSSA compliance Zimbabwe"],
  },

  BUSINESS_ACUMEN: {
    titleKeyword:
      "Startup Business Acumen & Growth Training Zimbabwe",
    metaDescription:
      "Business growth and startup training for Zimbabwean entrepreneurs.",
    h1:
      "Startup Business Acumen & Growth Training Zimbabwe",
    keywords: ["business acumen Zimbabwe"],
  },
};

// ─────────────────────────────────────────────────────────────
// LABELS
// ─────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  TAX_ACCOUNTING: "Tax",
  COMPANY_REG: "Registration",
  ZIMRA_TAX_REG: "ZIMRA",
  TAX_CLEARANCE: "Clearance",
  SME_ACCOUNTING: "Accounting",
  STOCK_TAKING: "Stock-Taking",
  COMPLIANCE: "Compliance",
  BUSINESS_ACUMEN: "Growth",
};

// ─────────────────────────────────────────────────────────────
// PREPARE LISTS
// ─────────────────────────────────────────────────────────────

const WHAT_TO_PREPARE: Record<
  ServiceCategory,
  string[]
> = {
  TAX_ACCOUNTING: [
    "Recent financial statements",
    "Income source details",
    "Any ZIMRA correspondence",
    "Questions you want addressed",
  ],

  COMPANY_REG: [
    "Proposed company names",
    "Director ID copies",
    "Physical address",
    "Business activity details",
  ],

  ZIMRA_TAX_REG: [
    "Certificate of incorporation",
    "National ID or passport",
    "Business address",
    "Business activity description",
  ],

  TAX_CLEARANCE: [
    "BP number",
    "Updated tax returns",
    "Settled tax obligations",
    "Registered business details",
  ],

  SME_ACCOUNTING: [
    "Bank statements",
    "Expense records",
    "Payroll details",
    "Current accounting records",
  ],

  STOCK_TAKING: [
    "Warehouse/store layout",
    "Preferred count date",
    "Stock categories",
    "Inventory system access",
  ],

  COMPLIANCE: [
    "Business registration documents",
    "BP number",
    "Employee records",
    "Compliance history",
  ],

  BUSINESS_ACUMEN: [
    "Business idea overview",
    "Current challenges",
    "Growth goals",
    "Questions you need help with",
  ],
};

// ─────────────────────────────────────────────────────────────
// FAQS
// ─────────────────────────────────────────────────────────────

const FAQS: Record<
  ServiceCategory,
  { q: string; a: string }[]
> = {
  COMPANY_REG: [
    {
      q: "How long does company registration take?",
      a:
        "Typically 5–15 business days depending on approvals.",
    },
  ],

  TAX_ACCOUNTING: [
    {
      q: "What does the consultation include?",
      a:
        "Tax planning, compliance guidance, and recommendations.",
    },
  ],

  TAX_CLEARANCE: [
    {
      q: "How long does it take?",
      a:
        "Usually 5–10 business days when all requirements are satisfied.",
    },
  ],

  ZIMRA_TAX_REG: [
    {
      q: "How do I get a BP number?",
      a:
        "Premasse handles the full registration process for you.",
    },
  ],

  SME_ACCOUNTING: [
    {
      q: "Do SMEs need bookkeeping?",
      a:
        "Yes — proper records improve compliance and growth decisions.",
    },
  ],

  STOCK_TAKING: [
    {
      q: "Can stock counts happen after hours?",
      a:
        "Yes — we can work outside operating hours if needed.",
    },
  ],

  COMPLIANCE: [
    {
      q: "Can you help if we are behind on compliance?",
      a:
        "Absolutely. We help businesses become fully compliant.",
    },
  ],

  BUSINESS_ACUMEN: [
    {
      q: "Is this suitable for beginners?",
      a:
        "Yes — ideal for startups and first-time entrepreneurs.",
    },
  ],
};

export const revalidate = 60;

// ─────────────────────────────────────────────────────────────
// STATIC PARAMS
// ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { slug: true },
  });

  return services.map((s) => ({
    slug: s.slug,
  }));
}

// ─────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      category: true,
    },
  });

  if (!service) {
    return {
      title: "Service not found",
    };
  }

  const seo =
    SEO_CONFIG[service.category] ||
    SEO_CONFIG.TAX_ACCOUNTING;

  return {
    title: seo.titleKeyword,
    description: seo.metaDescription,
  };
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service || !service.isActive) {
    notFound();
  }

  const seo =
    SEO_CONFIG[service.category] ||
    SEO_CONFIG.TAX_ACCOUNTING;

  const preparations =
    WHAT_TO_PREPARE[service.category] ?? [];

  const faqs =
    FAQS[service.category] ?? [];

  const categoryImage =
    CATEGORY_IMAGES[service.category] ||
    CATEGORY_IMAGES.TAX_ACCOUNTING;

  const canonicalUrl =
    `${SITE_URL}/services/${slug}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: seo.titleKeyword,
    description: service.description,
    url: canonicalUrl,
  };

  return (
    <>
      <Script
        id={`structured-data-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            structuredData
          ),
        }}
      />

      <main className="bg-[#041f19] overflow-hidden">

        {/* HERO */}
        {/* HERO */}
<section className="relative min-h-screen flex items-center overflow-hidden">

  {/* Atmosphere */}
  <div className="absolute inset-0 pointer-events-none">

    {/* Gold glow */}
    <div className="absolute top-[-140px] left-[-120px] w-[500px] h-[500px] rounded-full bg-[#C9A84C]/10 blur-3xl animate-pulse" />

    {/* Emerald glow */}
    <div className="absolute bottom-[-220px] right-[-140px] w-[620px] h-[620px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />

    {/* Grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  </div>

  {/* Background Image */}
  <div className="absolute inset-0">

    <Image
      src={categoryImage}
      alt={service.name}
      fill
      priority
      sizes="100vw"
      className="
        object-cover
        brightness-[1.02]
        contrast-[1.05]
        saturate-[1.05]
        scale-[1.03]
        animate-[slowZoom_18s_ease-in-out_infinite_alternate]
      "
    />

    {/* Cinematic overlays */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#041f19]/95 via-[#041f19]/78 to-black/35" />

    <div className="absolute inset-0 bg-black/20" />

    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#C9A84C]/10" />

    <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.22)]" />
  </div>

  <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-32 sm:pt-36 pb-24 w-full">

    <div className="max-w-3xl animate-fade-up">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-white/35 text-xs tracking-[0.18em] uppercase mb-8">

        <Link
          href="/services"
          className="hover:text-white/60 transition-colors"
        >
          Services
        </Link>

        <span>/</span>

        <span className="text-white/60">
          {service.name}
        </span>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-3 mb-8">

        <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

          <Sparkles className="w-4 h-4 text-[#C9A84C]" />

          <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
            {
              CATEGORY_LABELS[
                service.category
              ]
            }
          </span>
        </div>
      </div>

      {/* Heading */}
      <h1
        className="font-display text-white leading-[0.95] mb-8"
        style={{
          fontSize: "clamp(3.2rem, 6vw, 6.4rem)",
          letterSpacing: "-0.05em",
        }}
      >
        {seo.h1}
      </h1>

      {/* Description */}
      <p className="font-body text-white text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mb-12">
        {service.description}
      </p>

      {/* CTA */}
      <div className="flex flex-wrap gap-4">

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />

          <span className="text-white/50 text-[11px] tracking-[0.18em] uppercase">
            ZIMRA Registered
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />

          <span className="text-white/50 text-[11px] tracking-[0.18em] uppercase">
            One business day response
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />

          <span className="text-white/50 text-[11px] tracking-[0.18em] uppercase">
            Zimbabwean business specialists
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

        {/* CONTENT */}
        <section className="relative bg-[#041f19] py-24 sm:py-28 px-6 overflow-hidden">

          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] right-[-120px] w-[420px] h-[420px] rounded-full bg-[#C9A84C]/8 opacity-70" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-10">

            {/* LEFT */}
            <div className="space-y-8">

              {/* About */}
              <GlassPanel>
                <SectionLabel title="About this service" />

                <p className="text-white/70 leading-relaxed text-base sm:text-lg">
                  {service.description}
                </p>
              </GlassPanel>

              {/* Prepare */}
              {preparations.length > 0 && (
                <GlassPanel>
                  <SectionLabel title="What to prepare" />

                  <div className="space-y-5">
                    {preparations.map(
                      (item) => (
                        <div
                          key={item}
                          className="
                            flex
                            items-start
                            gap-4
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-5
                          "
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />

                          <span className="text-white/70 leading-relaxed">
                            {item}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </GlassPanel>
              )}

              {/* FAQ */}
              {faqs.length > 0 && (
                <GlassPanel>
                  <SectionLabel title="Frequently asked questions" />

                  <div className="space-y-5">
                    {faqs.map(
                      (faq, i) => (
                        <div
                          key={i}
                          className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            p-6
                          "
                        >
                          <h2 className="text-white text-lg font-semibold mb-3">
                            {faq.q}
                          </h2>

                          <p className="text-white/65 leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </GlassPanel>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">

              <div
                className="
                  sticky
                  top-6
                  overflow-hidden
                  rounded-[2.5rem]
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-8
                  shadow-[0_40px_120px_rgba(0,0,0,0.25)]
                "
              >

                <div className="absolute top-[-80px] right-[-80px] w-[220px] h-[220px] rounded-full bg-[#C9A84C]/10 opacity-70" />

                <div className="relative">

                  <h3 className="font-display text-white text-3xl leading-tight mb-4">
                    Ready to get started?
                  </h3>

                  <p className="text-white/60 leading-relaxed mb-8">
                    Submit your request and one of our specialists
                    will contact you within one business day.
                  </p>

                  <Link
                    href={`/request?service=${service.slug}`}
                    className="
                      group
                      relative
                      overflow-hidden
                      w-full
                      bg-[#C9A84C]
                      text-[#041f19]
                      font-semibold
                      px-8
                      py-4
                      rounded-2xl
                      text-sm
                      tracking-[0.16em]
                      uppercase
                      text-center
                      transition-all
                      duration-500
                      hover:-translate-y-1
                      hover:shadow-[0_20px_60px_rgba(201,168,76,0.35)]
                      inline-flex
                      items-center
                      justify-center
                      gap-3
                      mb-4
                    "
                  >
                    Request this service

                    <ArrowUpRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/contact"
                    className="
                      border
                      border-white/10
                      bg-white/[0.04]
                      text-white
                      hover:text-[#C9A84C]
                      transition-all
                      duration-300
                      px-8
                      py-4
                      rounded-2xl
                      text-sm
                      tracking-[0.16em]
                      uppercase
                      text-center
                      block
                    "
                  >
                    Ask a question
                  </Link>

                  {/* Price */}
                  {service.price && (
                    <div className="mt-8 pt-6 border-t border-white/10">
                      <p className="text-[#C9A84C] text-2xl font-semibold">
                        From $
                        {service.price.toFixed(
                          2
                        )}
                      </p>

                      <p className="text-white/35 text-xs mt-2">
                        Final quotation provided after review
                      </p>
                    </div>
                  )}

                  {/* Trust */}
                  <div className="mt-8 pt-6 border-t border-white/10 space-y-4">

                    {[
                      "ZIMRA registered specialists",
                      "One business day response",
                      "Professional documentation",
                      "WE HELP YOU GROW",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />

                        <span className="text-white/55 text-sm">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Back */}
              <Link
                href="/services"
                className="
                  flex
                  items-center
                  gap-3
                  text-white/45
                  hover:text-white
                  transition-colors
                  duration-300
                  text-sm
                "
              >
                ← Back to all services
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// GLASS PANEL
// ─────────────────────────────────────────────────────────────

function GlassPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[2.5rem]
        border
        border-white/10
        bg-white/[0.04]
        p-8
        sm:p-10
        shadow-[0_40px_120px_rgba(0,0,0,0.25)]
      "
    >
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION LABEL
// ─────────────────────────────────────────────────────────────

function SectionLabel({
  title,
}: {
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="h-px w-10 bg-[#C9A84C]" />

      <span className="text-[#C9A84C] text-xs tracking-[0.22em] uppercase font-semibold">
        {title}
      </span>
    </div>
  );
}
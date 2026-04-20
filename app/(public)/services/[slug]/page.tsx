// app/(public)/services/[slug]/page.tsx
// Individual service page with full SEO: unique title, description,
// canonical URL, OG image, and Service structured data per page.

import { Metadata }  from "next";
import Link          from "next/link";
import Script        from "next/script";
import { notFound }  from "next/navigation";
import { prisma }    from "@/lib/prisma";
import Navbar        from "@/components/layout/Navbar";
import Footer        from "@/components/layout/Footer";
import { ServiceCategory } from "@prisma/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

// ── SEO keyword targeting per service ────────────────────────────────────────
// These map directly to what Zimbabweans actually search on Google.

const SEO_CONFIG: Record<ServiceCategory, {
  titleKeyword:       string;
  metaDescription:    string;
  h1:                 string;
  keywords:           string[];
}> = {
  TAX_CLEARANCE: {
    titleKeyword:    "ITF263 Tax Clearance Certificate Zimbabwe",
    metaDescription: "Get your ZIMRA ITF263 Tax Clearance Certificate in Zimbabwe fast. Required for government tenders, contracts, and business transactions. Apply online with Premasse.",
    h1:              "Tax Clearance Certificate (ITF263) Zimbabwe",
    keywords: [
      "tax clearance certificate Zimbabwe", "ITF263 Zimbabwe", "ZIMRA tax clearance",
      "tax clearance Harare", "ITF263 application Zimbabwe", "ZIMRA clearance certificate",
    ],
  },
  COMPANY_REG: {
    titleKeyword:    "Company Registration Zimbabwe",
    metaDescription: "Register your company in Zimbabwe under COBE. Includes name reservation, certificate of incorporation, and CR14. Fast, professional company registration in Harare.",
    h1:              "Company Registration Zimbabwe",
    keywords: [
      "company registration Zimbabwe", "register a company Zimbabwe", "company registration Harare",
      "COBE company registration", "register private limited company Zimbabwe", "CR14 Zimbabwe",
    ],
  },
  ZIMRA_TAX_REG: {
    titleKeyword:    "ZIMRA Tax Registration Zimbabwe",
    metaDescription: "ZIMRA tax registration services in Zimbabwe. BP number, VAT registration, and PAYE registration for businesses. Expert help from registered practitioners in Harare.",
    h1:              "ZIMRA Tax Registration Zimbabwe",
    keywords: [
      "ZIMRA registration Zimbabwe", "ZIMRA BP number Zimbabwe", "VAT registration Zimbabwe",
      "PAYE registration Zimbabwe", "tax registration Harare", "ZIMRA account Zimbabwe",
    ],
  },
  TAX_ACCOUNTING: {
    titleKeyword:    "Tax Accountant Consultation Zimbabwe",
    metaDescription: "One-on-one consultation with a registered PAAB tax accountant in Zimbabwe. Get expert tax advice for your business or personal affairs in Harare.",
    h1:              "Registered Tax Accountant Consultation Zimbabwe",
    keywords: [
      "tax accountant Zimbabwe", "tax consultant Harare", "PAAB accountant Zimbabwe",
      "tax advice Zimbabwe", "registered accountant Harare", "tax planning Zimbabwe",
    ],
  },
  SME_ACCOUNTING: {
    titleKeyword:    "SME Accounting Services Zimbabwe",
    metaDescription: "Accounting services for small businesses in Zimbabwe. Monthly bookkeeping, payroll, management accounts, and annual financial statements in Harare.",
    h1:              "SME Accounting Services Zimbabwe",
    keywords: [
      "SME accounting Zimbabwe", "bookkeeping Zimbabwe", "payroll services Zimbabwe",
      "accounting services Harare", "small business accounting Zimbabwe", "management accounts Zimbabwe",
    ],
  },
};

// ── Static generation ─────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where:  { isActive: true },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

// ── Per-page metadata ─────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where:  { slug },
    select: { name: true, description: true, category: true },
  });

  if (!service) return { title: "Service not found" };

  const seo = SEO_CONFIG[service.category];
  const canonicalUrl = `${SITE_URL}/services/${slug}`;

  return {
    title:       seo.titleKeyword,
    description: seo.metaDescription,
    keywords:    seo.keywords,

    alternates: { canonical: canonicalUrl },

    openGraph: {
      title:       `${seo.titleKeyword} | Premasse`,
      description: seo.metaDescription,
      url:         canonicalUrl,
      type:        "website",
      locale:      "en_ZW",
      images: [{
        url:    `${SITE_URL}/og-image.png`,
        width:  1200,
        height: 630,
        alt:    `${seo.titleKeyword} — Premasse Business Services`,
      }],
    },

    twitter: {
      card:        "summary_large_image",
      title:       `${seo.titleKeyword} | Premasse`,
      description: seo.metaDescription,
      images:      [`${SITE_URL}/og-image.png`],
    },
  };
}

// ── Category labels + what to prepare ────────────────────────────────────────

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  TAX_ACCOUNTING: "Tax",
  COMPANY_REG:    "Registration",
  ZIMRA_TAX_REG:  "ZIMRA",
  TAX_CLEARANCE:  "Clearance",
  SME_ACCOUNTING: "Accounting",
};

const WHAT_TO_PREPARE: Record<ServiceCategory, string[]> = {
  TAX_ACCOUNTING: [
    "Recent financial statements or bank statements",
    "Details of income sources",
    "Any existing ZIMRA correspondence",
    "List of questions or issues you want to address",
  ],
  COMPANY_REG: [
    "Proposed company name (3 options in order of preference)",
    "Names and ID copies of all directors and shareholders",
    "Physical and postal address",
    "Intended business activities",
  ],
  ZIMRA_TAX_REG: [
    "Certificate of incorporation (for companies)",
    "National ID or passport",
    "Physical business address",
    "Nature of business activities",
  ],
  TAX_CLEARANCE: [
    "BP number (ZIMRA taxpayer number)",
    "Tax returns up to date",
    "Any outstanding tax payments settled",
    "Business or personal details as registered with ZIMRA",
  ],
  SME_ACCOUNTING: [
    "Bank statements (last 3–6 months)",
    "Sales and expense records",
    "Existing accounting software access (if any)",
    "Payroll details (if employees exist)",
  ],
};

// ── FAQ per service (boosts SEO with FAQ schema) ──────────────────────────────

const FAQS: Record<ServiceCategory, { q: string; a: string }[]> = {
  TAX_CLEARANCE: [
    { q: "How long does it take to get a tax clearance certificate in Zimbabwe?", a: "With all documents in order, ZIMRA typically processes ITF263 applications within 5–10 business days. Premasse handles the entire application process on your behalf." },
    { q: "What is an ITF263 tax clearance certificate?", a: "An ITF263 is a certificate issued by ZIMRA confirming that a taxpayer is up to date with their tax obligations. It is required for government tenders, contracts, and many business transactions in Zimbabwe." },
    { q: "What do I need to get a tax clearance certificate in Zimbabwe?", a: "You need your BP number, up-to-date tax returns, and any outstanding tax payments must be settled. Premasse will guide you through exactly what is required for your situation." },
  ],
  COMPANY_REG: [
    { q: "How long does company registration take in Zimbabwe?", a: "Under COBE (Companies and Other Business Entities Act), company registration typically takes 5–15 business days. Premasse handles name reservation, incorporation, and all documentation." },
    { q: "How much does it cost to register a company in Zimbabwe?", a: "Government fees vary by company type. Contact Premasse for a full cost breakdown including our professional fees, which are agreed upfront before any work begins." },
    { q: "What documents do I need to register a company in Zimbabwe?", a: "You need a proposed company name, ID copies of all directors and shareholders, a physical address, and details of intended business activities. Premasse manages the entire process." },
  ],
  ZIMRA_TAX_REG: [
    { q: "How do I get a BP number in Zimbabwe?", a: "A BP (Business Partner) number is assigned by ZIMRA when you register for tax. Premasse handles the full ZIMRA registration process including BP number, VAT, and PAYE registration." },
    { q: "When do I need to register for VAT in Zimbabwe?", a: "You must register for VAT in Zimbabwe when your taxable turnover reaches the prescribed threshold. Premasse advises on whether you need VAT registration and handles the process." },
    { q: "What is PAYE in Zimbabwe and do I need to register?", a: "PAYE (Pay As You Earn) is the tax deducted from employee salaries. Any business with employees must register for PAYE with ZIMRA. Premasse handles PAYE registration and ongoing compliance." },
  ],
  TAX_ACCOUNTING: [
    { q: "What does a tax accountant consultation cover?", a: "A Premasse tax consultation covers your current tax obligations, potential savings, compliance gaps, and a clear action plan. All consultations are with PAAB-registered practitioners." },
    { q: "How much does a tax consultation cost in Zimbabwe?", a: "Fees are agreed upfront before the consultation. Contact Premasse for current rates — we price fairly for SMEs and individuals." },
    { q: "Do I need a registered accountant in Zimbabwe?", a: "For tax advice and submissions, it is strongly recommended to use a PAAB-registered accountant. Premasse practitioners are fully registered with the Public Accountants and Auditors Board of Zimbabwe." },
  ],
  SME_ACCOUNTING: [
    { q: "What accounting services do small businesses in Zimbabwe need?", a: "Most SMEs need monthly bookkeeping, payroll processing, VAT returns, quarterly management accounts, and annual financial statements. Premasse provides all of these." },
    { q: "How much does SME accounting cost in Zimbabwe?", a: "Premasse offers SME-friendly pricing agreed upfront. Contact us for a quote based on your business size and requirements — no hourly surprises." },
    { q: "What is the difference between bookkeeping and accounting?", a: "Bookkeeping is the daily recording of transactions. Accounting interprets those records to produce financial statements, tax returns, and business insights. Premasse provides both." },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────

export const revalidate = 60;

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service || !service.isActive) notFound();

  const seo          = SEO_CONFIG[service.category];
  const preparations = WHAT_TO_PREPARE[service.category] ?? [];
  const faqs         = FAQS[service.category] ?? [];
  const canonicalUrl = `${SITE_URL}/services/${slug}`;

  // Service + FAQ structured data
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":       "Service",
        name:          seo.titleKeyword,
        description:   service.description,
        url:           canonicalUrl,
        provider: {
          "@type": "AccountingService",
          name:    "Premasse Business Services",
          url:     SITE_URL,
        },
        areaServed: {
          "@type": "Country",
          name:    "Zimbabwe",
        },
        serviceType: CATEGORY_LABELS[service.category],
      },
      ...(faqs.length > 0 ? [{
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type":          "Question",
          name:             faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text:    faq.a,
          },
        })),
      }] : []),
    ],
  };

  return (
    <>
      <Script
        id={`structured-data-${slug}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceStructuredData) }}
      />

      <Navbar />
      <main>
        {/* Hero */}
        <div className="bg-navy pt-32 pb-16 px-6 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-4xl">
            <div className="flex items-center gap-2 font-body text-white/30 text-xs mb-8">
              <Link href="/services" className="hover:text-white/60 transition-colors">Services</Link>
              <span>/</span>
              <span className="text-white/60">{service.name}</span>
            </div>

            <span className="inline-block font-body text-[10px] tracking-[0.2em] uppercase font-semibold text-gold border border-gold/40 px-2.5 py-1 rounded-sm mb-5">
              {CATEGORY_LABELS[service.category]}
            </span>

            {/* Use keyword-rich H1 for SEO */}
            <h1 className="font-display text-white text-4xl md:text-5xl leading-tight mb-6">
              {seo.h1}
            </h1>
            <p className="font-body text-white/65 text-lg leading-relaxed max-w-2xl">
              {service.description}
            </p>
            {service.price && (
              <p className="font-body text-gold text-base font-medium mt-4">
                From ${service.price.toFixed(2)} USD
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-cream py-20 px-6">
          <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Main content */}
            <div className="md:col-span-2 space-y-10">

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-gold" />
                  <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">About this service</span>
                </div>
                <p className="font-body text-slate text-base leading-relaxed">{service.description}</p>
              </div>

              {preparations.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-gold" />
                    <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">What to prepare</span>
                  </div>
                  <ul className="space-y-3">
                    {preparations.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                        <span className="font-body text-slate text-base leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-gold" />
                  <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">How it works</span>
                </div>
                <ol className="space-y-5">
                  {[
                    { n: "1", title: "Submit your request",      body: "Fill in the form with a brief description. It takes less than 2 minutes." },
                    { n: "2", title: "We review and contact you", body: "A registered practitioner reviews your submission and contacts you within one business day." },
                    { n: "3", title: "We handle everything",      body: "We prepare all documentation, submit to ZIMRA or the relevant authority, and follow up until completion." },
                  ].map(({ n, title, body }) => (
                    <li key={n} className="flex gap-5">
                      <span className="font-display text-3xl text-gold/30 font-bold leading-none flex-shrink-0 w-6 pt-0.5">{n}</span>
                      <div>
                        <p className="font-body text-navy font-medium mb-1">{title}</p>
                        <p className="font-body text-slate/70 text-sm leading-relaxed">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* FAQ Section — targets "People also ask" in Google */}
              {faqs.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-px w-8 bg-gold" />
                    <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">Frequently asked questions</span>
                  </div>
                  <div className="space-y-5">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border-b border-gray-100 pb-5">
                        <h2 className="font-display text-navy text-base font-semibold mb-2">
                          {faq.q}
                        </h2>
                        <p className="font-body text-slate text-sm leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar CTA */}
            <aside className="space-y-5">
              <div className="bg-white border border-gray-100 rounded-sm p-6 sticky top-6">
                <h3 className="font-display text-navy text-lg font-semibold mb-2">Get started today</h3>
                <p className="font-body text-slate/70 text-sm leading-relaxed mb-6">
                  Submit a request and we'll be in touch within one business day.
                </p>

                <Link
                  href={`/request?service=${service.slug}`}
                  className="btn-gold block w-full font-body font-semibold text-navy px-6 py-3.5 rounded-sm text-sm tracking-wide text-center mb-4"
                >
                  Request this service
                </Link>

                <Link
                  href="/contact"
                  className="block w-full font-body text-navy border border-navy/20 hover:border-navy/50 px-6 py-3.5 rounded-sm text-sm tracking-wide text-center transition-colors"
                >
                  Ask a question first
                </Link>

                {service.price && (
                  <p className="font-body text-slate/40 text-xs text-center mt-4">
                    From ${service.price.toFixed(2)} USD · quote provided on review
                  </p>
                )}

                {/* Trust signals */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
                  {[
                    "PAAB registered practitioners",
                    "Response within 1 business day",
                    "Fees agreed upfront",
                  ].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                      <span className="font-body text-slate/60 text-xs">{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/services"
                className="flex items-center gap-2 font-body text-slate/50 text-sm hover:text-navy transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                All services
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

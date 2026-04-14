// app/(public)/services/[slug]/page.tsx

import { Metadata }  from "next";
import Link          from "next/link";
import { notFound }  from "next/navigation";
import { prisma }    from "@/lib/prisma";
import Navbar        from "@/components/layout/Navbar";
import Footer        from "@/components/layout/Footer";
import { ServiceCategory } from "@prisma/client";

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where:  { isActive: true },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where:  { slug },
    select: { name: true, description: true },
  });
  if (!service) return { title: "Service not found" };
  return { title: service.name, description: service.description };
}

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  TAX_ACCOUNTING:  "Tax",
  COMPANY_REG:     "Registration",
  ZIMRA_TAX_REG:   "ZIMRA",
  TAX_CLEARANCE:   "Clearance",
  SME_ACCOUNTING:  "Accounting",
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

  const preparations = WHAT_TO_PREPARE[service.category] ?? [];

  return (
    <>
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
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 font-body text-white/30 text-xs mb-8">
              <Link href="/services" className="hover:text-white/60 transition-colors">
                Services
              </Link>
              <span>/</span>
              <span className="text-white/60">{service.name}</span>
            </div>

            <span className="inline-block font-body text-[10px] tracking-[0.2em] uppercase font-semibold text-gold border border-gold/40 px-2.5 py-1 rounded-sm mb-5">
              {CATEGORY_LABELS[service.category]}
            </span>

            <h1 className="font-display text-white text-4xl md:text-5xl leading-tight mb-6">
              {service.name}
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
                  <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">
                    About this service
                  </span>
                </div>
                <p className="font-body text-slate text-base leading-relaxed">
                  {service.description}
                </p>
              </div>

              {preparations.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px w-8 bg-gold" />
                    <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">
                      What to prepare
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {preparations.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0 mt-2" />
                        <span className="font-body text-slate text-base leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-body text-slate/50 text-sm mt-4 leading-relaxed">
                    Don&apos;t have everything ready? Submit your request anyway and
                    describe your situation — we&apos;ll guide you through what&apos;s needed.
                  </p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-gold" />
                  <span className="font-body text-gold text-xs tracking-[0.2em] uppercase font-medium">
                    How it works
                  </span>
                </div>
                <ol className="space-y-5">
                  {[
                    { n: "1", title: "Submit your request",      body: "Fill in the request form with a brief description of your situation. It takes less than 2 minutes." },
                    { n: "2", title: "We review and contact you", body: "A registered practitioner reviews your submission and contacts you within one business day." },
                    { n: "3", title: "We handle everything",      body: "Once engaged, we prepare all documentation, submit to ZIMRA or the relevant authority, and follow up until completion." },
                  ].map(({ n, title, body }) => (
                    <li key={n} className="flex gap-5">
                      <span className="font-display text-3xl text-gold/30 font-bold leading-none flex-shrink-0 w-6 pt-0.5">
                        {n}
                      </span>
                      <div>
                        <p className="font-body text-navy font-medium mb-1">{title}</p>
                        <p className="font-body text-slate/70 text-sm leading-relaxed">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sidebar CTA */}
            <aside className="space-y-5">
              <div className="bg-white border border-gray-100 rounded-sm p-6 sticky top-6">
                <h3 className="font-display text-navy text-lg font-semibold mb-2">
                  Get started
                </h3>
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

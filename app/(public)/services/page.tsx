// app/(public)/services/page.tsx
// SEO metadata added — targets "services Zimbabwe" keywords.

import { Metadata }  from "next";
import Link          from "next/link";
import { prisma }    from "@/lib/prisma";
import Navbar        from "@/components/layout/Navbar";
import Footer        from "@/components/layout/Footer";
import Script        from "next/script";
import { ServiceCategory } from "@prisma/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

export const metadata: Metadata = {
  title:       "Services — Tax & Business Services Zimbabwe",
  description: "Professional tax and business services in Zimbabwe: company registration, ZIMRA tax registration, ITF263 tax clearance certificates, and SME accounting. Harare-based PAAB-registered practitioners.",
  alternates:  { canonical: `${SITE_URL}/services` },
  keywords: [
    "tax services Zimbabwe", "business services Harare", "company registration Zimbabwe",
    "tax clearance Zimbabwe", "ZIMRA registration", "accounting services Zimbabwe",
  ],
  openGraph: {
    title:       "Services | Premasse Business Services Zimbabwe",
    description: "Tax clearance, company registration, ZIMRA registration, and SME accounting in Zimbabwe.",
    url:         `${SITE_URL}/services`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
};

export const revalidate = 60;

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  TAX_ACCOUNTING: "Tax",
  COMPANY_REG:    "Registration",
  ZIMRA_TAX_REG:  "ZIMRA",
  TAX_CLEARANCE:  "Clearance",
  SME_ACCOUNTING: "Accounting",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where:   { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // ItemList structured data for Google
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type":    "ItemList",
    name:       "Premasse Business Services",
    itemListElement: services.map((s, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       s.name,
      url:        `${SITE_URL}/services/${s.slug}`,
      description: s.description,
    })),
  };

  return (
    <>
      <Script
        id="services-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
      />

      <Navbar />
      <main>
        <div className="bg-navy pt-32 pb-16 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">What we offer</span>
            </div>
            <h1 className="font-display text-white text-4xl md:text-5xl leading-tight mb-4">
              Our services
            </h1>
            <p className="font-body text-white/60 text-lg leading-relaxed max-w-xl">
              Professional tax and business services for Zimbabwean SMEs and individuals. All work carried out by PAAB-registered practitioners.
            </p>
          </div>
        </div>

        <div className="bg-cream py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group bg-white p-8 hover:bg-navy transition-colors duration-300 flex flex-col"
                >
                  <span className="inline-block font-body text-[10px] tracking-[0.2em] uppercase font-semibold text-gold border border-gold/40 group-hover:border-gold/60 px-2.5 py-1 rounded-sm mb-6 w-fit">
                    {CATEGORY_LABELS[service.category]}
                  </span>
                  <h2 className="font-display text-navy group-hover:text-white text-xl font-semibold leading-snug mb-4 transition-colors duration-300">
                    {service.name}
                  </h2>
                  <p className="font-body text-slate group-hover:text-white/65 text-sm leading-relaxed flex-1 transition-colors duration-300">
                    {service.description}
                  </p>
                  {service.price && (
                    <p className="font-body text-gold text-sm font-medium mt-4">
                      From ${service.price.toFixed(2)}
                    </p>
                  )}
                  <div className="mt-8 flex items-center gap-2 text-gold text-sm font-body font-medium">
                    <span>Learn more</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transform group-hover:translate-x-1 transition-transform duration-200">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-navy py-16 px-6">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-white text-2xl font-semibold mb-2">Not sure which service you need?</h2>
              <p className="font-body text-white/60 text-base">Submit a request and describe your situation — we&apos;ll figure it out together.</p>
            </div>
            <Link href="/request" className="btn-gold font-body font-semibold text-navy px-8 py-4 rounded-sm text-base tracking-wide shrink-0">
              Request a service
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

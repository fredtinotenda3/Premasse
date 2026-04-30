// app/(public)/services/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Script from "next/script";
import { ServiceCategory } from "@prisma/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

export const metadata: Metadata = {
  title: "Services — Tax, Business & Stock-Taking Services Zimbabwe",
  description:
    "Professional tax, business, and stock-taking services in Zimbabwe: company registration, ZIMRA tax registration, ITF263 tax clearance, SME accounting, and physical stock counting. Harare-based PAAB-registered practitioners.",
  alternates: { canonical: `${SITE_URL}/services` },
  keywords: [
    "tax services Zimbabwe",
    "business services Harare",
    "company registration Zimbabwe",
    "tax clearance Zimbabwe",
    "ZIMRA registration",
    "accounting services Zimbabwe",
    "stock taking Zimbabwe",
    "physical stock counting Zimbabwe",
    "inventory audit Zimbabwe",
  ],
  openGraph: {
    title: "Services | Premasse Business Services Zimbabwe",
    description:
      "Tax clearance, company registration, ZIMRA registration, SME accounting, and stock-taking services in Zimbabwe.",
    url: `${SITE_URL}/services`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
};

export const revalidate = 60;

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  TAX_ACCOUNTING: "Tax",
  COMPANY_REG: "Registration",
  ZIMRA_TAX_REG: "ZIMRA",
  TAX_CLEARANCE: "Clearance",
  SME_ACCOUNTING: "Accounting",
  STOCK_TAKING: "Stock-Taking",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Premasse Business Services",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE_URL}/services/${s.slug}`,
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

      <main>
        {/* Hero with image - larger, matching homepage height */}
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

          {/* Hero image — right-side bleed */}
          <div
            className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <Image
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85&auto=format&fit=crop"
              alt="Professional business services"
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
              {/* Label */}
              <div
                className="flex items-center gap-3 mb-8 animate-fade-up"
                style={{ animationDelay: "0.05s", opacity: 0 }}
              >
                <div className="h-px w-10 bg-gold" />
                <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
                  What we offer
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-display text-white leading-[1.08] mb-6 animate-fade-up"
                style={{
                  fontSize: "clamp(3rem, 5.5vw, 5.2rem)",
                  animationDelay: "0.15s",
                  opacity: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Our services
              </h1>

              {/* Description */}
              <p
                className="font-body text-white/60 leading-relaxed mb-12 animate-fade-up"
                style={{
                  fontSize: "1.125rem",
                  maxWidth: "560px",
                  animationDelay: "0.28s",
                  opacity: 0,
                }}
              >
                Professional tax, business, and stock-taking services for
                Zimbabwean SMEs and individuals. All work carried out by
                registered practitioners.
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
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="transform group-hover:translate-x-1 transition-transform duration-200"
                    >
                      <path
                        d="M3 8h10M9 4l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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
              <h2 className="font-display text-white text-2xl font-semibold mb-2">
                Not sure which service you need?
              </h2>
              <p className="font-body text-white/60 text-base">
                Submit a request and describe your situation — we&apos;ll figure it
                out together.
              </p>
            </div>
            <Link
              href="/request"
              className="btn-gold font-body font-semibold text-navy px-8 py-4 rounded-sm text-base tracking-wide shrink-0"
            >
              Request a service
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
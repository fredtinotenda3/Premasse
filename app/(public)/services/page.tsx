// app/(public)/services/page.tsx
// Lists all active Premasse services fetched from the database.
// Each card links to the individual service detail page.

import { Metadata }  from "next";
import Link          from "next/link";
import { prisma }    from "@/lib/prisma";
import Navbar        from "@/components/layout/Navbar";
import Footer        from "@/components/layout/Footer";
import { ServiceCategory } from "@prisma/client";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Tax accountant consultations, company registration, ZIMRA tax registration, tax clearance certificates, and SME accounting services in Zimbabwe.",
};

export const revalidate = 60;

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  TAX_ACCOUNTING:  "Tax",
  COMPANY_REG:     "Registration",
  ZIMRA_TAX_REG:   "ZIMRA",
  TAX_CLEARANCE:   "Clearance",
  SME_ACCOUNTING:  "Accounting",
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where:   { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      <Navbar />
      <main>
        {/* Page header */}
        <div className="bg-navy pt-32 pb-16 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
                What we offer
              </span>
            </div>
            <h1 className="font-display text-white text-4xl md:text-5xl leading-tight mb-4">
              Our services
            </h1>
            <p className="font-body text-white/60 text-lg leading-relaxed max-w-xl">
              Professional tax and business services for Zimbabwean SMEs and
              individuals. All work carried out by registered practitioners.
            </p>
          </div>
        </div>

        {/* Services grid */}
        <div className="bg-cream py-20 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group bg-white p-8 hover:bg-navy transition-colors duration-300 flex flex-col"
                >
                  {/* Category pill */}
                  <span className="inline-block font-body text-[10px] tracking-[0.2em] uppercase font-semibold text-gold border border-gold/40 group-hover:border-gold/60 px-2.5 py-1 rounded-sm mb-6 w-fit">
                    {CATEGORY_LABELS[service.category]}
                  </span>

                  {/* Name */}
                  <h2 className="font-display text-navy group-hover:text-white text-xl font-semibold leading-snug mb-4 transition-colors duration-300">
                    {service.name}
                  </h2>

                  {/* Description */}
                  <p className="font-body text-slate group-hover:text-white/65 text-sm leading-relaxed flex-1 transition-colors duration-300">
                    {service.description}
                  </p>

                  {/* Price (if set) */}
                  {service.price && (
                    <p className="font-body text-gold text-sm font-medium mt-4">
                      From ${service.price.toFixed(2)}
                    </p>
                  )}

                  {/* Arrow */}
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

        {/* CTA strip */}
        <div className="bg-navy py-16 px-6">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-white text-2xl font-semibold mb-2">
                Not sure which service you need?
              </h2>
              <p className="font-body text-white/60 text-base">
                Submit a request and describe your situation — we&apos;ll figure it out together.
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
      <Footer />
    </>
  );
}

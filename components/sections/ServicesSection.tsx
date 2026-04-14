import Link from "next/link";

const services = [
  {
    category: "Tax",
    name: "Tax Accountant Consultation",
    slug: "tax-accountant-consultation",
    description:
      "One-on-one consultation with a registered tax accountant. We review your financial position and advise on obligations.",
  },
  {
    category: "Registration",
    name: "Company Registration",
    slug: "company-registration",
    description:
      "End-to-end company registration under COBE. Includes name reservation, certificate of incorporation, and CR14.",
  },
  {
    category: "ZIMRA",
    name: "ZIMRA / Tax Registration",
    slug: "zimra-tax-registration",
    description:
      "BP number, VAT, and PAYE registration with ZIMRA. We handle the paperwork and follow-up on your behalf.",
  },
  {
    category: "Clearance",
    name: "Tax Clearance Certificate",
    slug: "tax-clearance",
    description:
      "Obtain your ITF263 quickly and correctly. Required for government tenders, contracts, and business transactions.",
  },
  {
    category: "Accounting",
    name: "SME Accounting Services",
    slug: "sme-accounting",
    description:
      "Monthly bookkeeping, management accounts, payroll, and annual financial statements for small businesses.",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-cream py-28" id="services">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
                What we do
              </span>
            </div>
            <h2 className="font-display text-navy text-4xl md:text-5xl leading-tight">
              Services built for
              <br />
              <em>Zimbabwean business.</em>
            </h2>
          </div>

          <p className="text-slate font-body text-base leading-relaxed max-w-sm md:text-right">
            Every service is handled by registered practitioners who
            understand the local regulatory environment.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {services.map((service, i) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group bg-white p-8 hover:bg-navy transition-colors duration-300 flex flex-col"
              style={{
                // Last card spans full width on 3-col if 5 items
                ...(i === 4 && services.length === 5
                  ? { gridColumn: "1 / -1" }
                  : {}),
              }}
            >
              {/* Category pill */}
              <span className="inline-block font-body text-[10px] tracking-[0.2em] uppercase font-semibold text-gold border border-gold/40 group-hover:border-gold/60 px-2.5 py-1 rounded-sm mb-6 w-fit">
                {service.category}
              </span>

              {/* Name */}
              <h3 className="font-display text-navy group-hover:text-white text-xl font-semibold leading-snug mb-4 transition-colors duration-300">
                {service.name}
              </h3>

              {/* Description */}
              <p className="font-body text-slate group-hover:text-white/65 text-sm leading-relaxed flex-1 transition-colors duration-300">
                {service.description}
              </p>

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

        {/* View all link */}
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="font-body text-navy border border-navy/25 hover:border-navy transition-colors duration-200 px-8 py-3.5 rounded-sm text-sm tracking-wide inline-block"
          >
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}

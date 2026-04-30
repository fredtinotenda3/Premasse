import Link from "next/link";

const SERVICE_GROUPS = [
  {
    group: "Tax & Compliance",
    accent: "#C9A84C",
    services: [
      {
        category: "Tax",
        name: "Tax Accountant Consultation",
        slug: "tax-accountant-consultation",
        description:
          "One-on-one consultation with a registered tax accountant. We review your financial position and advise on obligations.",
      },
      {
        category: "Clearance",
        name: "Tax Clearance Certificate",
        slug: "tax-clearance",
        description:
          "Obtain your ITF263 quickly and correctly. Required for government tenders, contracts, and business transactions.",
      },
      {
        category: "ZIMRA",
        name: "ZIMRA / Tax Registration",
        slug: "zimra-tax-registration",
        description:
          "BP number, VAT, and PAYE registration with ZIMRA. We handle the paperwork and follow-up on your behalf.",
      },
    ],
  },
  {
    group: "Business Formation",
    accent: "#C9A84C",
    services: [
      {
        category: "Registration",
        name: "Company Registration",
        slug: "company-registration",
        description:
          "End-to-end company registration under COBE. Includes name reservation, certificate of incorporation, and CR14.",
      },
      {
        category: "Accounting",
        name: "SME Accounting Services",
        slug: "sme-accounting",
        description:
          "Monthly bookkeeping, management accounts, payroll, and annual financial statements for small businesses.",
      },
    ],
  },
  {
    group: "Stock-Taking & Inventory",
    accent: "#C9A84C",
    services: [
      {
        category: "Stock",
        name: "Physical Stock Counting",
        slug: "physical-stock-counting",
        description:
          "Independent and accurate stock verification in warehouses, factories, and retail stores.",
      },
      {
        category: "Stock",
        name: "Stock Reconciliation",
        slug: "stock-reconciliation",
        description:
          "Comparing physical stock with accounting or ERP records to resolve discrepancies.",
      },
      {
        category: "Stock",
        name: "Warehouse Stock Audits",
        slug: "warehouse-stock-audits",
        description:
          "Full independent audits of warehouse inventory. Verify quantities, condition, and location.",
      },
      {
        category: "Stock",
        name: "Year-End Stock Verification",
        slug: "year-end-stock-verification",
        description:
          "Independent stock counts required for financial audits. Credible, documented inventory verification.",
      },
    ],
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-cream py-28" id="services">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-end">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
                What we do
              </span>
            </div>
            <h2 className="font-display text-navy leading-[1.1]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              Services built for
              <br />
              <em className="text-gold">Zimbabwean business.</em>
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="font-body text-slate text-base leading-relaxed max-w-sm">
              Every service is handled by registered practitioners who understand the local regulatory environment.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-body text-navy text-sm mt-6 border-b border-navy/20 hover:border-navy pb-0.5 transition-colors duration-150"
            >
              View all 14 services
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Service groups */}
        <div className="space-y-16">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.group}>
              {/* Group label */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-body text-xs text-slate/40 tracking-[0.18em] uppercase font-medium">
                  {group.group}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Services grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-gray-200">
                {group.services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="group bg-white p-7 hover:bg-navy transition-colors duration-300 flex flex-col min-h-[200px]"
                  >
                    {/* Category pill */}
                    <span className="inline-block font-body text-[9px] tracking-[0.22em] uppercase font-semibold text-gold border border-gold/35 group-hover:border-gold/50 px-2 py-0.5 rounded-sm mb-5 w-fit">
                      {service.category}
                    </span>

                    {/* Name */}
                    <h3 className="font-display text-navy group-hover:text-white text-base font-semibold leading-snug mb-3 transition-colors duration-300">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="font-body text-slate/60 group-hover:text-white/55 text-sm leading-relaxed flex-1 transition-colors duration-300">
                      {service.description}
                    </p>

                    {/* Arrow */}
                    <div className="mt-6 flex items-center gap-1.5 text-gold text-xs font-body font-medium">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Learn more</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-10 border-t border-gray-200">
          <p className="font-body text-slate/60 text-sm max-w-md">
            Don&apos;t see what you need? Describe your situation and we&apos;ll advise on the right service.
          </p>
          <Link
            href="/request"
            className="btn-gold text-navy font-body font-semibold px-7 py-3.5 rounded-sm text-sm tracking-wide shrink-0"
          >
            Request a service
          </Link>
        </div>
      </div>
    </section>
  );
}
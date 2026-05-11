import Link from "next/link";
import Image from "next/image";

const SERVICE_GROUPS = [
  {
    group: "Tax & Compliance",
    accent: "#C9A84C",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1400&q=90&auto=format&fit=crop",
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
      {
        category: "Compliance",
        name: "NSSA Compliance",
        slug: "nssa-compliance",
        description:
          "National Social Security Authority registration and compliance. We ensure your business meets all NSSA requirements.",
      },
      {
        category: "Compliance",
        name: "PRAZ Compliance",
        slug: "praz-compliance",
        description:
          "Procurement Regulatory Authority of Zimbabwe compliance. Get your business registered for government tenders.",
      },
      {
        category: "Compliance",
        name: "ZIMDEF Compliance",
        slug: "zimdef-compliance",
        description:
          "Zimbabwe Manpower Development Fund compliance. We handle your ZIMDEF registration and levy submissions.",
      },
    ],
  },
  {
    group: "Business Formation & Growth",
    accent: "#C9A84C",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1400&q=90&auto=format&fit=crop",
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
        name: "Accounting Services",
        slug: "accounting-services",
        description:
          "Professional accounting services including financial statements, management accounts, and tax returns.",
      },
      {
        category: "Bookkeeping",
        name: "Bookkeeping Services",
        slug: "bookkeeping-services",
        description:
          "Daily, weekly, or monthly bookkeeping to keep your financial records accurate and up to date.",
      },
      {
        category: "Advisory",
        name: "Startup Business Acumen",
        slug: "startup-business-acumen",
        description:
          "We help startups gain simple business acumen knowledge to help them in their day-to-day operations. WE HELP YOU GROW.",
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
    image:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=90&auto=format&fit=crop",
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
    <section
      className="relative bg-[#f7f4ee] py-28 overflow-hidden"
      id="services"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-120px] left-[-80px] w-[340px] h-[340px] rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-100px] w-[420px] h-[420px] rounded-full bg-emerald-100 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12">

        {/* Section header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24 items-end">
          
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-gold" />

              <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
                What we do
              </span>
            </div>

            <h2
              className="font-display text-green-dark leading-[1.05]"
              style={{
                fontSize: "clamp(2.4rem, 4vw, 4rem)",
              }}
            >
              Services built for
              <br />

              <em className="text-gold">
                Zimbabwean business.
              </em>
            </h2>
          </div>

          <div className="lg:pb-2">
            <p className="font-body text-slate text-base leading-relaxed max-w-md">
              Every service is handled by ZIMRA-registered practitioners who
              understand the local regulatory environment.
            </p>

            <Link
              href="/services"
              className="
                inline-flex
                items-center
                gap-2
                font-body
                text-green-dark
                text-sm
                mt-6
                border-b
                border-green-dark/20
                hover:border-green-dark
                pb-0.5
                transition-colors
                duration-150
              "
            >
              View all services

              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7h8M7 3l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Service groups */}
        <div className="space-y-24">
          {SERVICE_GROUPS.map((group) => (
            <div key={group.group}>
              
              {/* Group label */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-body text-xs text-slate/40 tracking-[0.18em] uppercase font-medium">
                  {group.group}
                </span>

                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Feature image */}
              <div className="relative rounded-[2rem] overflow-hidden mb-10 min-h-[260px] lg:min-h-[360px] group shadow-[0_25px_80px_rgba(0,0,0,0.08)]">
                
                <Image
                  src={group.image}
                  alt={group.group}
                  fill
                  sizes="100vw"
                  className="
                    object-cover
                    transition-transform
                    duration-[4000ms]
                    group-hover:scale-105
                  "
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#062b22]/75 via-[#062b22]/25 to-gold/10" />

                {/* Content */}
                <div className="absolute inset-0 flex items-end p-8 lg:p-12">
                  <div className="max-w-2xl">
                    
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 backdrop-blur-md px-4 py-2 mb-5">
                      <div className="w-2 h-2 rounded-full bg-gold" />

                      <span className="text-gold text-[10px] tracking-[0.24em] uppercase font-body font-semibold">
                        Professional Services
                      </span>
                    </div>

                    <h3 className="font-display text-white text-3xl lg:text-5xl leading-tight mb-4">
                      {group.group}
                    </h3>

                    <p className="text-white/75 font-body text-sm lg:text-base leading-relaxed max-w-xl">
                      Trusted solutions tailored for Zimbabwean businesses,
                      helping organizations remain compliant, efficient,
                      and growth-focused.
                    </p>
                  </div>
                </div>
              </div>

              {/* Services grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {group.services.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-[1.8rem]
                      border
                      border-black/[0.04]
                      bg-white/80
                      backdrop-blur-sm
                      p-7
                      transition-all
                      duration-300
                      hover:bg-green-dark
                      hover:-translate-y-1
                      hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]
                    "
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/10 to-transparent" />

                    {/* Category pill */}
                    <span className="
                      relative
                      inline-block
                      font-body
                      text-[9px]
                      tracking-[0.22em]
                      uppercase
                      font-semibold
                      text-gold
                      border
                      border-gold/35
                      group-hover:border-gold/50
                      px-2.5
                      py-1
                      rounded-full
                      mb-5
                      w-fit
                    ">
                      {service.category}
                    </span>

                    {/* Name */}
                    <h3 className="
                      relative
                      font-display
                      text-green-dark
                      group-hover:text-white
                      text-lg
                      font-semibold
                      leading-snug
                      mb-4
                      transition-colors
                      duration-300
                    ">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="
                      relative
                      font-body
                      text-slate/65
                      group-hover:text-white/65
                      text-sm
                      leading-relaxed
                      flex-1
                      transition-colors
                      duration-300
                    ">
                      {service.description}
                    </p>

                    {/* Arrow */}
                    <div className="relative mt-7 flex items-center gap-2 text-gold text-xs font-body font-semibold tracking-wide uppercase">
                      
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        Learn more
                      </span>

                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="
                          transform
                          translate-x-0
                          group-hover:translate-x-1
                          transition-all
                          duration-200
                          opacity-0
                          group-hover:opacity-100
                        "
                      >
                        <path
                          d="M2 7h10M7 2l5 5-5 5"
                          stroke="currentColor"
                          strokeWidth="1.3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-12 border-t border-black/10">
          
          <div>
            <p className="font-body text-slate/60 text-sm max-w-md leading-relaxed">
              Don&apos;t see what you need? Describe your situation and
              we&apos;ll advise on the right service for your business.
            </p>
          </div>

          <Link
            href="/request"
            className="
              group
              relative
              overflow-hidden
              bg-gold
              text-green-dark
              font-body
              font-semibold
              px-8
              py-4
              rounded-2xl
              text-sm
              tracking-[0.14em]
              uppercase
              shrink-0
              transition-all
              duration-500
              hover:-translate-y-1
              hover:shadow-[0_20px_60px_rgba(201,168,76,0.35)]
            "
          >
            <span className="relative z-10">
              Request a Service
            </span>

            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </Link>
        </div>
      </div>
    </section>
  );
}
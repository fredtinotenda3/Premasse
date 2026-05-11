// app/(public)/services/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { prisma } from "@/lib/prisma";
import { ServiceCategory } from "@prisma/client";
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

export const metadata: Metadata = {
  title:
    "Services — Tax, Compliance, Accounting & Business Growth Zimbabwe",
  description:
    "Professional tax, compliance, accounting, and stock-taking services in Zimbabwe: company registration, NSSA, PRAZ, ZIMDEF compliance, ZIMRA tax registration, ITF263 tax clearance, SME accounting, bookkeeping, and startup business acumen. Harare-based ZIMRA-registered practitioners. WE HELP YOU GROW.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: "Services | Premasse Business Services Zimbabwe",
    description:
      "Tax clearance, company registration, NSSA, PRAZ, ZIMDEF compliance, accounting, bookkeeping, and stock-taking services in Zimbabwe.",
    url: `${SITE_URL}/services`,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
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
  TAX_COMPLIANCE: "Compliance",
  BUSINESS_ADVISORY: "Advisory",
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListStructuredData),
        }}
      />

      <main className="bg-[#041f19] overflow-hidden">
        
        {/* HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          
          {/* Ambient background */}
          <div className="absolute inset-0 pointer-events-none">
            
            {/* Gold glow */}
            <div className="absolute top-[-140px] left-[-120px] w-[500px] h-[500px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

            {/* Emerald glow */}
            <div className="absolute bottom-[-220px] right-[-140px] w-[620px] h-[620px] rounded-full bg-emerald-500/10 blur-3xl" />

            {/* Mesh grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Full background image */}
          <div className="absolute inset-0">
            
            <Image
              src="/images/services/services-hero.png"
              alt="African business professionals"
              fill
              priority
              sizes="100vw"
              className="
                object-cover
                brightness-[1.02]
                contrast-[1.05]
                saturate-[1.05]
              "
            />

            {/* Main cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#041f19]/92 via-[#041f19]/70 to-black/25" />

            {/* Additional dark layer */}
            <div className="absolute inset-0 bg-black/25" />

            {/* Warm premium tone */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#C9A84C]/10" />

            {/* Soft vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />
          </div>

          <div
            className="
              relative
              z-10
              mx-auto
              max-w-7xl
              px-6
              lg:px-12
              pt-32
              sm:pt-36
              pb-20
              sm:pb-24
              w-full
            "
          >
            <div
              className="
                max-w-3xl
                relative
                z-20
              "
            >
              
              {/* Badge */}
              <div className="inline-flex items-center gap-3 mb-8">
                
                <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md">
                  
                  <Sparkles className="w-4 h-4 text-[#C9A84C]" />

                  <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
                    Professional Zimbabwean Business Services
                  </span>
                </div>
              </div>

              {/* Heading */}
              <h1
                className="font-display text-white leading-[0.95] mb-8"
                style={{
                  fontSize: "clamp(3.2rem, 6vw, 6.5rem)",
                  letterSpacing: "-0.05em",
                }}
              >
                Services built for
                <br />

                <span className="relative inline-block text-[#C9A84C] italic">
                  Zimbabwean business.

                  <span className="absolute left-0 bottom-2 w-full h-[12px] bg-[#C9A84C]/15 blur-sm rounded-full -z-10" />
                </span>
              </h1>

              {/* Description */}
              <p
                className="
                  font-body
                  text-white
                  text-base
                  sm:text-lg
                  lg:text-xl
                  leading-relaxed
                  max-w-2xl
                  mb-12
                "
              >
                Tax, compliance, accounting, advisory, and stock-taking
                services designed to help Zimbabwean businesses stay compliant,
                financially organized, and growth-focused.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                
                <Link
                  href="/request"
                  className="
                    group
                    relative
                    overflow-hidden
                    w-full
                    sm:w-auto
                    bg-[#C9A84C]
                    text-[#041f19]
                    font-body
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
                  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Request a Service

                    <ArrowUpRight className="w-4 h-4" />
                  </span>

                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>

                <Link
                  href="/contact"
                  className="
                    border
                    w-full
                    sm:w-auto
                    border-white/10
                    bg-white/[0.04]
                    backdrop-blur-md
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
                    hover:-translate-y-1
                  "
                >
                  Speak to us
                </Link>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mt-10 sm:mt-12">
                {[
                  "ZIMRA Registered",
                  "SME Specialists",
                  "Zimbabwean Business Advisory",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/70" />

                    <span className="text-white/40 text-[11px] tracking-[0.18em] uppercase font-body">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="relative py-24 sm:py-28">
          
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[20%] right-[-120px] w-[420px] h-[420px] rounded-full bg-[#C9A84C]/8 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">

            {/* Section heading */}
            <div className="mb-14 sm:mb-16">
              
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-[#C9A84C]" />

                <span className="text-[#C9A84C] text-xs tracking-[0.22em] uppercase font-body font-semibold">
                  What we offer
                </span>
              </div>

              <h2
                className="font-display text-white leading-[1]"
                style={{
                  fontSize: "clamp(2.6rem, 4vw, 4.8rem)",
                  letterSpacing: "-0.04em",
                }}
              >
                Tailored business
                <br />

                <span className="text-white/55">
                  solutions.
                </span>
              </h2>
            </div>

            {/* Services cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className={`
                    group
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-white/10
                    bg-white/[0.03]
                    backdrop-blur-xl
                    p-8
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:bg-white/[0.05]
                    hover:border-[#C9A84C]/20
                    hover:shadow-[0_30px_80px_rgba(0,0,0,0.25)]
                    ${
                      index === 0
                        ? "xl:col-span-2 xl:min-h-[380px]"
                        : ""
                    }
                  `}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#C9A84C]/10 to-transparent" />

                  {/* Accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex flex-col h-full">
                    
                    {/* Category */}
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-2
                        text-[10px]
                        tracking-[0.22em]
                        uppercase
                        font-semibold
                        text-[#C9A84C]
                        border
                        border-[#C9A84C]/30
                        bg-[#C9A84C]/5
                        px-3
                        py-1.5
                        rounded-full
                        w-fit
                        mb-7
                      "
                    >
                      <ShieldCheck className="w-3 h-3" />

                      {CATEGORY_LABELS[service.category]}
                    </span>

                    {/* Title */}
                    <h2
                      className={`
                        font-display
                        text-white
                        leading-tight
                        mb-5
                        transition-colors
                        duration-300
                        ${
                          index === 0
                            ? "text-3xl sm:text-4xl"
                            : "text-2xl"
                        }
                      `}
                    >
                      {service.name}
                    </h2>

                    {/* Description */}
                    <p className="font-body text-white/60 text-sm md:text-base leading-relaxed flex-1">
                      {service.description}
                    </p>

                    {/* Price */}
                    {service.price && (
                      <div className="mt-6">
                        <span className="text-[#C9A84C] text-lg font-semibold">
                          From ${service.price.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                      
                      <span className="text-white/45 text-sm">
                        Learn more
                      </span>

                      <div
                        className="
                          w-11
                          h-11
                          rounded-full
                          border
                          border-white/10
                          bg-white/[0.03]
                          flex
                          items-center
                          justify-center
                          transition-all
                          duration-300
                          group-hover:bg-[#C9A84C]
                          group-hover:border-[#C9A84C]
                        "
                      >
                        <ArrowUpRight className="w-4 h-4 text-white group-hover:text-[#041f19]" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="relative py-20 sm:py-24">
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute bottom-[-180px] left-[-120px] w-[520px] h-[520px] rounded-full bg-[#C9A84C]/8 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
            
            <div
              className="
                relative
                overflow-hidden
                rounded-[2.5rem]
                border
                border-white/10
                bg-white/[0.04]
                backdrop-blur-2xl
                p-8
                sm:p-10
                lg:p-16
                shadow-[0_40px_120px_rgba(0,0,0,0.35)]
              "
            >
              
              {/* Internal glow */}
              <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

              <div className="relative flex flex-col xl:flex-row items-start xl:items-center justify-between gap-12">
                
                {/* Left */}
                <div className="max-w-3xl">
                  
                  <div className="flex items-center gap-3 mb-6">
                    
                    <div className="h-px w-10 bg-[#C9A84C]" />

                    <span className="text-[#C9A84C] text-xs tracking-[0.22em] uppercase font-body font-semibold">
                      Let&apos;s work together
                    </span>
                  </div>

                  <h2
                    className="font-display text-white leading-[0.95] mb-6"
                    style={{
                      fontSize: "clamp(2.4rem, 4vw, 5rem)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    Not sure which
                    <br />

                    <span className="text-[#C9A84C] italic">
                      service you need?
                    </span>
                  </h2>

                  <p className="font-body text-white/65 text-base sm:text-lg leading-relaxed max-w-2xl">
                    Tell us about your business or situation and our specialists
                    will guide you toward the right compliance, accounting,
                    advisory, or growth solution.
                  </p>
                </div>

                {/* Right */}
                <div className="w-full xl:w-auto flex flex-col sm:flex-row gap-4">
                  
                  <Link
                    href="/request"
                    className="
                      group
                      relative
                      overflow-hidden
                      w-full
                      sm:w-auto
                      bg-[#C9A84C]
                      text-[#041f19]
                      font-body
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
                    "
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Request a Service

                      <ArrowUpRight className="w-4 h-4" />
                    </span>

                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </Link>

                  <Link
                    href="/contact"
                    className="
                      border
                      w-full
                      sm:w-auto
                      border-white/10
                      bg-white/[0.04]
                      backdrop-blur-md
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
                      hover:-translate-y-1
                    "
                  >
                    Speak to us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
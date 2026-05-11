// app/(public)/about/page.tsx

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  MapPin,
  Mail,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Premasse Business Services is a ZIMRA-registered tax and business services firm based in Harare, Zimbabwe, serving SMEs and individuals across the country. WE HELP YOU GROW.",
};

const VALUES = [
  {
    title: "ZIMRA-registered practitioners",
    body: "All our accountants are ZIMRA-registered professionals. You deal with qualified experts who understand Zimbabwe's tax system inside out.",
  },
  {
    title: "Local expertise",
    body: "We understand Zimbabwe's tax legislation, ZIMRA processes, NSSA, PRAZ, ZIMDEF, and the Companies and Other Business Entities Act inside and out.",
  },
  {
    title: "Transparent fees",
    body: "We agree fees upfront before any work begins. No hourly surprises, no hidden costs. SME-friendly pricing.",
  },
  {
    title: "End-to-end handling",
    body: "We prepare, submit, and follow up with ZIMRA and relevant authorities until the job is fully done.",
  },
  {
    title: "WE HELP YOU GROW",
    body: "Beyond compliance, we provide practical business guidance to help startups and SMEs thrive.",
  },
];

const SERVICES_SUMMARY = [
  "ZIMRA Registered Tax Accountant Consultations",
  "Company Registration",
  "NSSA · PRAZ · ZIMDEF Compliance",
  "Accounting & Bookkeeping Services",
  "Tax Clearance Certificates (ITF263)",
  "Startup Business Acumen",
];

export default function AboutPage() {
  return (
    <main className="bg-[#041f19] overflow-hidden">
      
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        
        {/* Atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          
          {/* Gold glow */}
          <div className="absolute top-[-140px] left-[-120px] w-[500px] h-[500px] rounded-full bg-[#C9A84C]/10 blur-3xl animate-pulse" />

          {/* Emerald glow */}
          <div className="absolute bottom-[-220px] right-[-140px] w-[620px] h-[620px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />

          {/* Grid texture */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Background image */}
        <div className="absolute inset-0">
          
          <Image
            src="/images/about/about-hero.png"
            alt="Professional corporate meeting"
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

          {/* Main overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041f19]/94 via-[#041f19]/78 to-black/35" />

          {/* Additional cinematic dark layer */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Warm gold tone */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#C9A84C]/10" />

          {/* Vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.25)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 pt-32 sm:pt-36 pb-24 w-full">
          
          <div className="max-w-3xl animate-fade-up">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-3 mb-8">
              
              <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">
                
                <Sparkles className="w-4 h-4 text-[#C9A84C]" />

                <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
                  Zimbabwean Business Specialists
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
              A firm built for
              <br />

              <span className="relative inline-block text-[#C9A84C] italic">
                Zimbabwean business growth.

                <span className="absolute left-0 bottom-2 w-full h-[12px] bg-[#C9A84C]/15 blur-sm rounded-full -z-10" />
              </span>
            </h1>

            {/* Description */}
            <p className="font-body text-white text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mb-12">
              Premasse Business Services is a ZIMRA-registered tax and business
              services firm based in Harare. We help SMEs and individuals stay
              compliant, get registered, and grow their businesses instead of
              chasing paperwork.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              
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
                  hover:shadow-[0_0_80px_rgba(201,168,76,0.08)]
                  w-full
                  sm:w-auto
                "
              >
                Contact us
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

      {/* MISSION */}
      <section className="relative py-24 sm:py-28">
        
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[10%] right-[-120px] w-[420px] h-[420px] rounded-full bg-[#C9A84C]/8 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
          
          <div
            className="
              relative
              overflow-hidden
              rounded-[2.5rem]
              border
              border-white/10
              bg-white/[0.03]
              backdrop-blur-2xl
              p-8
              sm:p-10
              lg:p-16
              shadow-[0_40px_120px_rgba(0,0,0,0.25)]
            "
          >
            
            <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16">
              
              {/* Left */}
              <div className="animate-fade-up">
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-10 bg-[#C9A84C]" />

                  <span className="text-[#C9A84C] text-xs tracking-[0.22em] uppercase font-body font-semibold">
                    Our mission
                  </span>
                </div>

                <h2
                  className="font-display text-white leading-[1] mb-8"
                  style={{
                    fontSize: "clamp(2.6rem, 4vw, 4.8rem)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  Compliance shouldn&apos;t
                  <br />

                  <span className="text-white/55">
                    be a full-time job.
                  </span>
                </h2>

                <div className="space-y-5">
                  <p className="font-body text-white/70 text-base sm:text-lg leading-relaxed">
                    Too many Zimbabwean business owners spend hours navigating
                    ZIMRA portals, chasing compliance certificates, and trying
                    to decode regulations.
                  </p>

                  <p className="font-body text-white/70 text-base sm:text-lg leading-relaxed">
                    Premasse exists to take that burden off your desk entirely.
                    We handle registrations, compliance, and accounting so you
                    can focus on growth.
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="animate-fade-up">
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-10 bg-[#C9A84C]" />

                  <span className="text-[#C9A84C] text-xs tracking-[0.22em] uppercase font-body font-semibold">
                    Services
                  </span>
                </div>

                <div className="space-y-4">
                  {SERVICES_SUMMARY.map((service) => (
                    <div
                      key={service}
                      className="
                        group
                        flex
                        items-start
                        gap-4
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        p-5
                        transition-all
                        duration-300
                        hover:bg-white/[0.05]
                        hover:border-[#C9A84C]/20
                        hover:shadow-[0_0_80px_rgba(201,168,76,0.08)]
                      "
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />

                      <span className="font-body text-white/70 text-sm sm:text-base leading-relaxed">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    number: "01",
    title: "ZIMRA-registered practitioners",
    body: "All our accountants are ZIMRA-registered professionals with deep expertise in Zimbabwe's tax legislation.",
    outcome: "You deal with qualified professionals who know the system inside out.",
  },
  {
    number: "02",
    title: "Full compliance specialists",
    body: "Deep familiarity with NSSA, PRAZ, ZIMDEF, and all regulatory requirements for Zimbabwean businesses.",
    outcome: "Complete compliance across all authorities. No gaps. No surprises.",
  },
  {
    number: "03",
    title: "SME-focused pricing",
    body: "We structure our fees around the realities of small and growing businesses.",
    outcome: "No hidden costs. No hourly surprises. Agreed upfront.",
  },
  {
    number: "04",
    title: "End-to-end handling",
    body: "We don't just advise — we prepare, submit, and follow up on your behalf.",
    outcome: "You focus on your business. We handle the paperwork.",
  },
  {
    number: "05",
    title: "WE HELP YOU GROW",
    body: "Beyond compliance, we provide business acumen and practical guidance to help startups thrive.",
    outcome: "Growth-focused advice that turns compliance into opportunity.",
  },
];

export default function WhyUs() {
  return (
    <section
      className="relative overflow-hidden bg-[#041f19] py-28"
      id="why-us"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* Gold glow */}
        <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

        {/* Green glow */}
        <div className="absolute bottom-[-180px] right-[-120px] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Global vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-14 items-start">

          {/* LEFT FEATURED SECTION */}
          <div className="sticky top-28">
            
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-10 bg-[#C9A84C]" />

              <span className="text-[#C9A84C] text-xs tracking-[0.24em] uppercase font-body font-semibold">
                Why Premasse
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-display text-white leading-[0.95] mb-8"
              style={{
                fontSize: "clamp(2.8rem, 5vw, 5.5rem)",
                letterSpacing: "-0.05em",
              }}
            >
              The firm that
              <br />

              <span className="relative inline-block text-[#C9A84C] italic">
                gets things done.

                <span className="absolute left-0 bottom-2 w-full h-[12px] bg-[#C9A84C]/15 blur-sm rounded-full -z-10" />
              </span>
            </h2>

            {/* Description */}
            <p className="font-body text-white/70 text-lg leading-relaxed max-w-xl mb-10">
              We combine regulatory expertise, practical business knowledge,
              and hands-on execution to help Zimbabwean businesses stay
              compliant and growth-focused.
            </p>

            {/* Featured image */}
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.25)]">
              
              <div className="relative min-h-[520px]">
                
                <Image
                  src="/images/why-us/premium-consultation.png"
                  alt="African business consultation"
                  fill
                  priority
                  sizes="(max-width: 1280px) 100vw, 45vw"
                  className="
                    object-cover
                    brightness-[1.02]
                    contrast-[1.05]
                    saturate-[1.05]
                  "
                />

                {/* Image overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#041f19]/90 via-[#041f19]/20 to-transparent" />

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#C9A84C]/10" />

                {/* Floating trust card */}
                <div className="absolute bottom-6 left-6 right-6">
                  
                  <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 shadow-2xl">
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                      <span className="text-white text-xs tracking-[0.18em] uppercase font-semibold">
                        Trusted Zimbabwean Specialists
                      </span>
                    </div>

                    <p className="text-white/70 text-sm leading-relaxed">
                      Professional tax, accounting, compliance, and advisory
                      services designed specifically for Zimbabwean businesses.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom trust line */}
            <div className="flex flex-wrap gap-5 mt-8">
              {[
                "ZIMRA Registered",
                "SME Specialists",
                "Growth-Focused Advisory",
              ].map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/70" />

                  <span className="text-white/40 text-[11px] tracking-[0.16em] uppercase font-body">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT REASONS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((r, idx) => (
              <div
                key={r.number}
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
                  ${idx === 0 ? "md:col-span-2" : ""}
                `}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#C9A84C]/10 to-transparent" />

                {/* Accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Number */}
                <span className="
                  relative
                  block
                  font-display
                  text-6xl
                  md:text-7xl
                  text-[#C9A84C]/12
                  group-hover:text-[#C9A84C]/20
                  leading-none
                  tracking-tighter
                  mb-6
                  transition-all
                  duration-500
                ">
                  {r.number}
                </span>

                {/* Title */}
                <h3 className="
                  relative
                  font-display
                  text-white
                  text-2xl
                  leading-tight
                  mb-4
                ">
                  {r.title}
                </h3>

                {/* Body */}
                <p className="
                  relative
                  font-body
                  text-white/60
                  text-sm
                  md:text-base
                  leading-relaxed
                  mb-6
                ">
                  {r.body}
                </p>

                {/* Outcome */}
                <div className="
                  relative
                  flex
                  items-start
                  gap-3
                  pt-5
                  border-t
                  border-white/10
                ">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />

                  <span className="font-body text-white/45 text-sm leading-relaxed">
                    {r.outcome}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust footer */}
        <div className="mt-20 pt-10 border-t border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="flex flex-wrap gap-6">
            {[
              "ZIMRA Registered",
              "NSSA · PRAZ · ZIMDEF Specialists",
              "Zimbabwean Business Advisory",
              "Professional Compliance Services",
            ].map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full bg-[#C9A84C]/60" />

                <span className="text-white/35 text-[11px] tracking-[0.18em] uppercase font-body">
                  {tag}
                </span>
              </div>
            ))}
          </div>

          <p className="font-mono text-white/20 text-[10px] tracking-[0.18em] uppercase">
            Verified practitioners · Growth-focused consultancy
          </p>
        </div>
      </div>
    </section>
  );
}
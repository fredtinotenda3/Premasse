// components/sections/WhyUs.tsx

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
    <section className="bg-green-dark py-28" id="why-us">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* Header */}
        <div className="mb-16 max-w-xl">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
              Why Premasse
            </span>
          </div>
          <h2 className="font-display text-white text-4xl md:text-5xl leading-tight">
            The firm that{" "}
            <em className="text-gold not-italic font-semibold">gets things done.</em>
          </h2>
        </div>

        {/* Reasons grid - 3x2 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {reasons.map((r, idx) => (
            <div
              key={r.number}
              className={`
                relative group
                ${idx % 3 !== 2 ? 'lg:border-r' : ''}
                ${idx < 3 ? 'lg:border-b' : ''}
                ${idx % 2 === 0 && idx < 2 ? 'md:border-r' : ''}
                ${idx < 2 ? 'md:border-b' : ''}
                border-white/8
              `}
            >
              {/* Hover accent line - left side */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-8 md:p-10 hover:bg-white/3 transition-colors duration-300">
                {/* Number - large watermark */}
                <span className="font-display text-6xl md:text-7xl text-gold/15 group-hover:text-gold/25 transition-all duration-300 block mb-6 leading-none tracking-tighter">
                  {r.number}
                </span>

                {/* Title */}
                <h3 className="font-display text-white text-xl md:text-2xl font-semibold mb-3 leading-snug tracking-tight">
                  {r.title}
                </h3>

                {/* Body description */}
                <p className="font-body text-white/50 text-sm md:text-base leading-relaxed mb-4">
                  {r.body}
                </p>

                {/* Outcome — Trust marker with icon */}
                <div className="flex items-start gap-2.5 pt-3 border-t border-white/8 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span className="font-body text-white/40 text-xs md:text-sm leading-relaxed">
                    {r.outcome}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust footer */}
        <div className="mt-16 pt-12 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-wrap gap-6">
            {[
              "ZIMRA Registered",
              "10+ Years Combined Experience",
              "Zimbabwean Business Specialists",
              "NSSA · PRAZ · ZIMDEF Compliant",
            ].map((tag) => (
              <div key={tag} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-gold/50" />
                <span className="font-body text-white/35 text-[11px] tracking-widest uppercase">
                  {tag}
                </span>
              </div>
            ))}
          </div>

          {/* Subtle stat */}
          <p className="font-mono text-white/20 text-[10px] tracking-wider">
            Verified practitioners · ZIMRA-registered consultants
          </p>
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";

const stats = [
  { value: "14+", label: "Services offered" },
  { value: "100%", label: "ZIMRA compliant" },
  { value: "1 Day", label: "Average response" },
  { value: "Local", label: "Zimbabwe pricing" },
];

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#041f19] py-28">
      
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* Gold glow */}
        <div className="absolute top-[-140px] left-[-100px] w-[420px] h-[420px] rounded-full bg-[#C9A84C]/12 blur-3xl" />

        {/* Green glow */}
        <div className="absolute bottom-[-180px] right-[-120px] w-[520px] h-[520px] rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Soft vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">

        {/* Main CTA Glass Panel */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/10
            bg-white/[0.04]
            backdrop-blur-2xl
            shadow-[0_40px_120px_rgba(0,0,0,0.35)]
          "
        >
          
          {/* Internal glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full bg-[#C9A84C]/10 blur-3xl" />
          </div>

          <div className="relative px-8 py-16 md:px-14 lg:px-20 lg:py-20">
            
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
              
              {/* LEFT CONTENT */}
              <div>
                
                {/* Badge */}
                <div className="inline-flex items-center gap-3 mb-8">
                  
                  <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md">
                    
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />

                    <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.22em] uppercase font-semibold">
                      Let&apos;s work together
                    </span>
                  </div>
                </div>

                {/* Heading */}
                <h2
                  className="font-display text-white leading-[0.95] mb-8"
                  style={{
                    fontSize: "clamp(3rem, 5vw, 5.5rem)",
                    letterSpacing: "-0.05em",
                  }}
                >
                  Ready to become
                  <br />

                  <span className="relative inline-block text-[#C9A84C] italic">
                    fully compliant?

                    <span className="absolute left-0 bottom-2 w-full h-[12px] bg-[#C9A84C]/15 blur-sm rounded-full -z-10" />
                  </span>
                </h2>

                {/* Description */}
                <p className="font-body text-white/70 text-lg leading-relaxed max-w-2xl mb-10">
                  Submit your request and one of our ZIMRA-registered
                  specialists will contact you within one business day to
                  discuss the right solution for your business.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  
                  {/* Primary CTA */}
                  <Link
                    href="/request"
                    className="
                      group
                      relative
                      overflow-hidden
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

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M3 8h10M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </Link>

                  {/* Secondary CTA */}
                  <Link
                    href="/contact"
                    className="
                      group
                      border
                      border-white/10
                      bg-white/[0.04]
                      backdrop-blur-md
                      text-white
                      hover:text-[#C9A84C]
                      hover:border-[#C9A84C]/30
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
                    Contact us
                  </Link>
                </div>
              </div>

              {/* RIGHT VISUAL SIDE */}
              <div className="relative">
                
                {/* Floating stats grid */}
                <div className="grid grid-cols-2 gap-5">
                  {stats.map(({ value, label }) => (
                    <div
                      key={label}
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[2rem]
                        border
                        border-white/10
                        bg-white/[0.03]
                        backdrop-blur-xl
                        p-7
                        transition-all
                        duration-500
                        hover:-translate-y-1
                        hover:bg-white/[0.05]
                        hover:border-[#C9A84C]/20
                        hover:shadow-[0_25px_60px_rgba(0,0,0,0.2)]
                      "
                    >
                      {/* Glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#C9A84C]/10 to-transparent" />

                      <div className="relative">
                        
                        <div className="font-display text-white text-4xl md:text-5xl leading-none mb-3">
                          {value}
                        </div>

                        <div className="font-body text-white/55 text-sm leading-relaxed">
                          {label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom floating trust strip */}
                <div
                  className="
                    mt-6
                    rounded-[2rem]
                    border
                    border-white/10
                    bg-black/20
                    backdrop-blur-xl
                    p-6
                  "
                >
                  <div className="flex items-center gap-3 mb-3">
                    
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                    <span className="text-white text-xs tracking-[0.18em] uppercase font-semibold">
                      Trusted Zimbabwean Specialists
                    </span>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed">
                    Helping businesses remain compliant, financially organized,
                    and growth-focused through professional accounting,
                    advisory, and compliance services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom micro trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          {[
            "ZIMRA Registered",
            "NSSA · PRAZ · ZIMDEF Specialists",
            "SME Focused",
            "Zimbabwean Business Advisory",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/70" />

              <span className="font-body text-white/35 text-[11px] tracking-[0.18em] uppercase">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
import Image from "next/image";

const stats = [
  { value: "14+", label: "Services" },
  { value: "1 day", label: "Response time" },
  { value: "100%", label: "ZIMRA compliant" },
  { value: "Local", label: "Zimbabwe owned" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#041f19] flex items-center">
      
      {/* Background atmosphere */}
      <div className="absolute inset-0">
        
        {/* Glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

        {/* Mesh grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          
          {/* LEFT CONTENT */}
          <div className="relative flex items-center px-6 lg:px-16 xl:px-24 py-20">
            
            {/* Left gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#041f19] via-[#041f19]/98 to-transparent z-0" />

            <div className="relative z-10 max-w-2xl">
              
              {/* Badge */}
              {/* <div className="inline-flex items-center gap-3 mb-8 animate-fade-up">
                <div className="flex items-center gap-2.5 border border-[#C9A84C]/40 bg-[#C9A84C]/10 backdrop-blur-md px-5 py-2.5 rounded-full">
                  
                  <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />

                  <span className="font-body text-[#C9A84C] text-[11px] sm:text-xs tracking-[0.24em] uppercase font-semibold">
                    ZIMRA Registered · Harare, Zimbabwe
                  </span>
                </div>
              </div> */}

              {/* Headline */}
              <h1
                className="font-display text-white leading-[0.95] mb-8"
                style={{
                  fontSize: "clamp(3rem, 6vw, 6.5rem)",
                  letterSpacing: "-0.05em",
                }}
              >
                Tax.
                <br />
                Compliance.
                <br />

                <span className="relative inline-block text-[#C9A84C] italic">
                  Business growth.

                  {/* underline glow */}
                  <span className="absolute left-0 bottom-2 w-full h-[12px] bg-[#C9A84C]/15 blur-sm -z-10 rounded-full" />
                </span>
              </h1>

              {/* Description */}
              <p
                className="font-body text-white/80 leading-relaxed mb-10 max-w-xl"
                style={{
                  fontSize: "clamp(1rem, 1.15vw, 1.15rem)",
                }}
              >
                ZIMRA-registered tax accountants and business specialists helping
                Zimbabwean businesses thrive — from company registration and
                compliance to accounting, advisory, and strategic growth support.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 mb-14">
                
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
                    rounded-xl
                    text-sm
                    tracking-[0.18em]
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

                <Link
                  href="/services"
                  className="
                    group
                    border
                    border-[#C9A84C]/40
                    bg-white/[0.04]
                    backdrop-blur-md
                    text-white
                    hover:text-[#C9A84C]
                    transition-all
                    duration-300
                    px-8
                    py-4
                    rounded-xl
                    text-sm
                    tracking-[0.18em]
                    uppercase
                    text-center
                    hover:-translate-y-1
                  "
                >
                  View Services
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                {stats.map(({ value, label }) => (
                  <div
                    key={label}
                    className="group relative"
                  >
                    <div className="flex flex-col">
                      
                      <span className="font-display text-white text-4xl leading-none mb-3">
                        {value}
                      </span>

                      <span className="font-body text-white/55 text-xs tracking-[0.14em] uppercase">
                        {label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative hidden lg:block min-h-screen">
            
            <div className="absolute inset-0">
              
              <Image
                src="/images/hero/african-business-consultation.png"
                alt="African business professionals discussing financial documents"
                fill
                priority
                sizes="50vw"
                className="
                  object-cover
                  brightness-[1.02]
                  contrast-[1.05]
                  saturate-[1.08]
                "
              />

              {/* Main cinematic fade */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 via-black/5 to-[#041f19]/85" />

              {/* Warm premium tone */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#C9A84C]/8" />

              {/* Soft vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.18)]" />
            </div>

            {/* Floating card */}
            <div className="absolute bottom-10 left-10 right-10">
              
              <div className="backdrop-blur-xl bg-black/25 border border-white/10 rounded-[2rem] p-6 shadow-2xl max-w-md">
                
                <div className="flex items-center gap-3 mb-4">
                  
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                  <span className="text-white text-sm font-semibold tracking-[0.16em] uppercase">
                    Trusted Financial Specialists
                  </span>
                </div>

                <p className="text-white/70 text-sm leading-relaxed">
                  Helping Zimbabwean businesses remain compliant, financially
                  organized, and growth-focused through expert accounting and
                  advisory services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
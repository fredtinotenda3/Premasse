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
    <section className="relative min-h-screen overflow-hidden bg-[#062b22] flex items-center">
      
      {/* Background atmosphere */}
      <div className="absolute inset-0">
        
        {/* Main radial glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-gold/10 blur-3xl" />

        {/* Secondary ambient glow */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Global gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30" />
      </div>

      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-screen">
          
          {/* LEFT CONTENT */}
          <div className="w-full px-6 lg:px-16 xl:px-24 py-16 lg:py-0">
            
            {/* Badge */}
            <div
              className="inline-flex items-center gap-3 mb-8 animate-fade-up"
              style={{
                animationDelay: "0.05s",
                opacity: 0,
              }}
            >
              {/* <div className="flex items-center gap-2.5 border border-gold/30 bg-gold/10 backdrop-blur-md px-5 py-2.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
                
                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />

                <span className="font-body text-gold text-[11px] sm:text-xs tracking-[0.24em] uppercase font-semibold">
                  ZIMRA Registered · Harare, Zimbabwe
                </span>
              </div> */}
            </div>

            {/* Headline */}
            <h1
              className="font-display text-white leading-[1.02] mb-6 animate-fade-up"
              style={{
                fontSize: "clamp(2.8rem, 5vw, 5.8rem)",
                animationDelay: "0.15s",
                opacity: 0,
                letterSpacing: "-0.04em",
              }}
            >
              Tax.
              <br />
              Compliance.
              <br />

              <span className="relative inline-block text-gold italic">
                Business growth.

                {/* Accent underline */}
                <span className="absolute left-0 bottom-1 w-full h-[10px] bg-gold/15 -z-10 rounded-sm" />
              </span>
            </h1>

            {/* Description */}
            <p
              className="font-body text-white/80 leading-relaxed mb-10 max-w-2xl animate-fade-up"
              style={{
                fontSize: "clamp(1rem, 1.15vw, 1.12rem)",
                animationDelay: "0.28s",
                opacity: 0,
              }}
            >
              ZIMRA-registered tax accountants and business specialists helping
              Zimbabwean businesses thrive — from company registration and
              compliance to accounting, advisory, and strategic growth support.
            </p>

            {/* CTA */}
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-up"
              style={{
                animationDelay: "0.42s",
                opacity: 0,
              }}
            >
              <Link
                href="/request"
                className="
                  group
                  relative
                  overflow-hidden
                  bg-gold
                  text-[#062b22]
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
                <span className="relative z-10">
                  Request a Service
                </span>

                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>

              <Link
                href="/services"
                className="
                  group
                  border
                  border-white/15
                  bg-white/5
                  backdrop-blur-md
                  text-white
                  hover:text-gold
                  hover:border-gold/40
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
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-12 pt-8 border-t border-white/10 animate-fade-up"
              style={{
                animationDelay: "0.56s",
                opacity: 0,
              }}
            >
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/6
                    bg-white/[0.03]
                    backdrop-blur-sm
                    px-4
                    py-5
                    transition-all
                    duration-300
                    hover:border-gold/20
                    hover:bg-white/[0.05]
                    hover:-translate-y-1
                  "
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/10 to-transparent" />

                  <span className="relative block font-display text-white text-2xl font-bold leading-none mb-2">
                    {value}
                  </span>

                  <span className="relative font-body text-white/45 text-[10px] sm:text-xs tracking-[0.16em] uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div
            className="relative flex min-h-[420px] lg:min-h-screen animate-fade-up"
            style={{
              animationDelay: "0.3s",
              opacity: 0,
            }}
          >
            <div className="relative w-full min-h-[420px] lg:min-h-screen overflow-hidden">
              
              {/* Main image */}
              <Image
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1400&q=90&auto=format&fit=crop"
                alt="Tax accountant reviewing financial documents"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="
                  object-cover
                  transition-transform
                  duration-[4000ms]
                  hover:scale-105
                "
              />

              {/* Premium overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#062b22]/70 via-[#062b22]/20 to-gold/10" />

              {/* Edge fade */}
              <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#062b22] to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10">
                <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-3xl p-5 lg:p-6 shadow-2xl max-w-md">
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

                    <span className="text-white text-xs lg:text-sm font-semibold tracking-wide uppercase">
                      Trusted Financial Specialists
                    </span>
                  </div>

                  <p className="text-white/75 text-xs lg:text-sm leading-relaxed">
                    Helping Zimbabwean businesses remain compliant,
                    financially organized, and growth-focused through
                    expert accounting and advisory services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
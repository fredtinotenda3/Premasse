import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-navy overflow-hidden flex items-center">

      {/* Architectural grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Hero image — right-side bleed, professional African business context */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none"
        aria-hidden="true"
      >
        {/* Unsplash: professional African business/office context */}
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=85&auto=format&fit=crop"
          alt="Professional business services"
          fill
          className="object-cover object-center"
          style={{ opacity: 1 }}
          sizes="50vw"
          priority
        />
        {/* Navy fade from left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #0A2540 0%, #0A2540 20%, rgba(10,37,64,0.7) 55%, rgba(10,37,64,0.15) 100%)",
          }}
        />
        {/* Navy fade from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0A2540 0%, transparent 40%)",
          }}
        />
      </div>

      {/* Diagonal gold accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(135deg, transparent 58%, rgba(201,168,76,0.03) 58%, rgba(201,168,76,0.03) 72%, transparent 72%)",
        }}
      />

      {/* Top gold rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gold opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12 pt-36 pb-28 w-full">
        <div className="max-w-2xl">

          {/* Credential badge */}
          <div
            className="inline-flex items-center gap-3 mb-10 animate-fade-up"
            style={{ animationDelay: "0.05s", opacity: 0 }}
          >
            <div
              className="flex items-center gap-2.5 border border-gold/25 px-4 py-2 rounded-sm"
              style={{ backgroundColor: "rgba(201,168,76,0.06)" }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="font-body text-gold text-xs tracking-[0.22em] uppercase font-medium">
                PAAB Registered · Harare, Zimbabwe
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-white leading-[1.08] mb-7 animate-fade-up"
            style={{
              fontSize: "clamp(3rem, 5.5vw, 5.2rem)",
              animationDelay: "0.15s",
              opacity: 0,
              letterSpacing: "-0.01em",
            }}
          >
            Tax. Compliance.{" "}
            <br />
            <span
              className="text-gold"
              style={{ fontStyle: "italic" }}
            >
              Done right.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="font-body text-white/60 leading-relaxed mb-12 animate-fade-up"
            style={{
              fontSize: "1.125rem",
              maxWidth: "520px",
              animationDelay: "0.28s",
              opacity: 0,
            }}
          >
            Registered tax accountants and business specialists serving
            Zimbabwean businesses — from company registration to ZIMRA
            clearance and physical stock-taking.
          </p>

          {/* CTA group */}
          <div
            className="flex flex-col sm:flex-row gap-3 animate-fade-up"
            style={{ animationDelay: "0.42s", opacity: 0 }}
          >
            <Link
              href="/request"
              className="btn-gold text-navy font-body font-semibold px-8 py-4 rounded-sm text-sm tracking-widest uppercase text-center"
            >
              Request a Service
            </Link>
            <Link
              href="/services"
              className="font-body text-white/75 hover:text-white border border-white/15 hover:border-white/35 transition-all duration-200 px-8 py-4 rounded-sm text-sm tracking-widest uppercase text-center"
            >
              View Services
            </Link>
          </div>

          {/* Trust strip */}
          <div
            className="flex flex-wrap gap-x-8 gap-y-3 mt-16 pt-12 border-t border-white/8 animate-fade-up"
            style={{ animationDelay: "0.56s", opacity: 0 }}
          >
            {[
              { value: "14", label: "Services" },
              { value: "1 day", label: "Response time" },
              { value: "100%", label: "ZIMRA compliant" },
              { value: "PAAB", label: "Registered" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="font-display text-white text-xl font-bold leading-none mb-1">
                  {value}
                </span>
                <span className="font-body text-white/35 text-xs tracking-widest uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(10,37,64,0.8))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
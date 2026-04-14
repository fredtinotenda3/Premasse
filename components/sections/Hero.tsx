import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-navy overflow-hidden flex items-center">

      {/* Diagonal gold accent stripe */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute"
          style={{
            top: "-10%",
            right: "-5%",
            width: "55%",
            height: "130%",
            background:
              "linear-gradient(135deg, transparent 40%, rgba(201,168,76,0.07) 40%, rgba(201,168,76,0.07) 60%, transparent 60%)",
            transform: "skewX(-8deg)",
          }}
        />
        {/* Fine gold border line */}
        <div
          className="absolute top-0 right-[30%] w-px h-full bg-gold opacity-20"
          style={{ transform: "rotate(8deg) translateX(120px)" }}
        />
      </div>

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-12 pt-32 pb-24 w-full">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8 animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
              Registered tax accountants · Harare, Zimbabwe
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display text-white leading-[1.1] mb-8 animate-fade-up"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              animationDelay: "0.2s",
              opacity: 0,
            }}
          >
            Your business,{" "}
            <span className="text-gold italic">fully compliant.</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="font-body text-white/65 text-xl leading-relaxed max-w-xl mb-12 animate-fade-up"
            style={{ animationDelay: "0.35s", opacity: 0 }}
          >
            From company registration to ZIMRA clearance — Premasse handles
            your tax and business obligations so you can focus on growing.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-up"
            style={{ animationDelay: "0.5s", opacity: 0 }}
          >
            <Link
              href="/request"
              className="btn-gold text-navy font-body font-semibold px-8 py-4 rounded-sm text-base tracking-wide text-center"
            >
              Request a service
            </Link>
            <Link
              href="/services"
              className="font-body text-white border border-white/25 hover:border-white/60 transition-colors duration-200 px-8 py-4 rounded-sm text-base tracking-wide text-center"
            >
              View all services
            </Link>
          </div>

          {/* Trust indicators */}
          <div
            className="flex flex-wrap gap-x-10 gap-y-3 mt-16 animate-fade-up"
            style={{ animationDelay: "0.65s", opacity: 0 }}
          >
            {[
              "Registered tax practitioners",
              "ZIMRA compliant",
              "SME specialists",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                <span className="text-white/50 text-sm font-body">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(10,37,64,0.6))",
        }}
        aria-hidden="true"
      />
    </section>
  );
}

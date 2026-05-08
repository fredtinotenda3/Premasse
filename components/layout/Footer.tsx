import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-green-dark text-white/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-4">
              <span className="font-display text-lg font-bold text-white tracking-wide">
                Premasse
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-body font-medium">
                Business Services
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              ZIMRA-registered tax accountants and business services specialists
              serving SMEs across Zimbabwe. WE HELP YOU GROW.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-gold font-body font-semibold mb-4">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "Tax Accountant Consultation",
                "Company Registration",
                "ZIMRA / Tax Registration",
                "Tax Clearance Certificate",
                "Accounting & Bookkeeping",
                "NSSA · PRAZ · ZIMDEF Compliance",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="hover:text-white transition-colors duration-200"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.15em] uppercase text-gold font-body font-semibold mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Harare, Zimbabwe</li>
              <li>
                <a
                  href="mailto:info@premasse.co.zw"
                  className="hover:text-white transition-colors duration-200"
                >
                  info@premasse.co.zw
                </a>
              </li>
            </ul>

            <Link
              href="/request"
              className="inline-block mt-6 btn-gold text-green-dark text-sm font-body font-semibold px-5 py-2.5 rounded-sm tracking-wide"
            >
              Request a service
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-white/40">
          <p>© {year} Premasse Business Services. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-white/70 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-white/70 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span className="font-display text-xl font-bold text-white tracking-wide">
            Premasse
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-body font-medium">
            Business Services
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Services",       href: "/services" },
            { label: "About",          href: "/about" },
            { label: "Contact",        href: "/contact" },
            { label: "Client portal",  href: "/portal/login" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-body text-white/80 hover:text-white transition-colors duration-200 tracking-wide"
            >
              {label}
            </Link>
          ))}

          <Link
            href="/request"
            className="btn-gold text-navy text-sm font-body font-semibold px-5 py-2.5 rounded-sm tracking-wide"
          >
            Request a service
          </Link>
        </div>

        {/* Mobile menu button — wired up in Phase 2 */}
        <button
          className="md:hidden text-white p-2"
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="2" y1="5"  x2="20" y2="5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </nav>
    </header>
  );
}

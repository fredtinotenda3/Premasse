"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close menu when clicking escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Handle scroll effect for mobile menu background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Client portal", href: "/portal/login" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || isMenuOpen ? "bg-green-dark shadow-lg" : "absolute bg-transparent"
    }`}>
      <nav className="mx-auto max-w-7xl px-6 lg:px-12 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group relative z-50">
          <span className="font-display text-xl font-bold text-white tracking-wide">
            Premasse
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-body font-medium">
            Business Services
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
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
            className="btn-gold text-green-dark text-sm font-body font-semibold px-5 py-2.5 rounded-sm tracking-wide"
          >
            Request a service
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2 relative z-50"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="2" y1="5"  x2="20" y2="5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="2" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          )}
        </button>

        {/* Mobile menu overlay */}
        <div
          className={`fixed inset-0 bg-green-dark/95 backdrop-blur-sm transition-all duration-300 md:hidden ${
            isMenuOpen 
              ? "opacity-100 visible" 
              : "opacity-0 invisible pointer-events-none"
          }`}
          style={{ top: "80px" }}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Mobile menu panel */}
        <div
          className={`fixed left-0 right-0 bg-green-dark transition-all duration-300 md:hidden ${
            isMenuOpen 
              ? "opacity-100 visible translate-y-0" 
              : "opacity-0 invisible -translate-y-4"
          }`}
          style={{ top: "80px" }}
        >
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="text-base font-body text-white/80 hover:text-white transition-colors duration-200 py-2 border-b border-white/10"
              >
                {label}
              </Link>
            ))}
            
            <Link
              href="/request"
              onClick={() => setIsMenuOpen(false)}
              className="btn-gold text-green-dark text-center font-body font-semibold px-5 py-3 rounded-sm tracking-wide mt-2"
            >
              Request a service
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
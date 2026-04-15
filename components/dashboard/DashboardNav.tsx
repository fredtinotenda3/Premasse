// components/dashboard/DashboardNav.tsx

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: "Requests",
    href: "/dashboard/requests",
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="2" y="7" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="2" y="12" width="7" height="2" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 12L6 7l3 3 3-4 2-2"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M2 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: "Services",
    href: "/dashboard/services",
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function DashboardNav({ 
  session 
}: { 
  session: any;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu when clicking escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string, exact: boolean) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button - visible only on mobile */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-navy/95 backdrop-blur-sm rounded-md shadow-lg"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          // Close icon
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          // Hamburger icon
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <line x1="2" y1="5" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="11" x2="20" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="2" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-navy/95 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isMobileMenuOpen 
            ? "opacity-100 visible" 
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile menu panel */}
      <div
        className={`fixed left-0 right-0 bg-navy transition-all duration-300 lg:hidden ${
          isMobileMenuOpen 
            ? "opacity-100 visible translate-y-0" 
            : "opacity-0 invisible -translate-y-4"
        }`}
        style={{ top: "80px" }}
      >
        <div className="flex flex-col p-6 gap-4">
          {NAV_ITEMS.map(({ label, href, exact, icon }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 text-base font-body py-2 border-b border-white/10 transition-colors duration-200 ${
                  active ? "text-gold" : "text-white/80 hover:text-white"
                }`}
              >
                <span className={active ? "text-gold" : ""}>{icon}</span>
                {label}
              </Link>
            );
          })}
          
          {/* User info in mobile menu */}
          <div className="pt-4 mt-2 border-t border-white/10">
            <p className="font-body text-white text-sm font-medium truncate mb-1">
              {session?.user?.name ?? "Admin"}
            </p>
            <p className="font-body text-white/40 text-xs truncate mb-4">
              {session?.user?.email}
            </p>
            
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 text-base font-body text-white/80 hover:text-white transition-colors duration-200 py-2"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar navigation - Full height */}
      <aside className="hidden lg:flex lg:flex-col lg:h-screen w-64 bg-navy shadow-2xl fixed lg:relative">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-white/10 shrink-0">
            <Link href="/" className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold text-white tracking-wide">
                Premasse
              </span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-gold font-body font-medium mt-0.5">
                Admin
              </span>
            </Link>
          </div>

          {/* Nav links - Scrollable if needed */}
          <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map(({ label, href, exact, icon }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body transition-colors duration-150 ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={active ? "text-gold" : ""}>{icon}</span>
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </div>

          {/* User info + sign out - Sticky at bottom */}
          <div className="px-3 py-4 border-t border-white/10 shrink-0">
            <div className="px-3 py-2 mb-1">
              <p className="font-body text-white text-sm font-medium truncate">
                {session?.user?.name ?? "Admin"}
              </p>
              <p className="font-body text-white/40 text-xs truncate">
                {session?.user?.email}
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body text-white/45 hover:text-white hover:bg-white/5 transition-colors duration-150"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
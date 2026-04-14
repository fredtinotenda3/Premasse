// components/dashboard/DashboardNav.tsx  (updated — Analytics link added)
// Replace your existing DashboardNav.tsx with this file.
// Only change: Analytics added to NAV_ITEMS.

import Link   from "next/link";
import { auth, signOut } from "@/auth";

const NAV_ITEMS = [
  {
    label: "Overview",
    href:  "/dashboard",
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
    href:  "/dashboard/requests",
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="2" y="7" width="12" height="3" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="2" y="12" width="7"  height="2" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
  },
  {
    label: "Analytics",
    href:  "/dashboard/analytics",
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
    href:  "/dashboard/services",
    exact: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default async function DashboardNav({
  activeHref,
}: {
  activeHref: string;
}) {
  const session = await auth();

  return (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold text-white tracking-wide">
            Premasse
          </span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-gold font-body font-medium mt-0.5">
            Admin
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map(({ label, href, exact, icon }) => {
          const isActive = exact
            ? activeHref === href
            : activeHref.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body transition-colors duration-150 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={isActive ? "text-gold" : ""}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>

      {/* User + sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="font-body text-white text-sm font-medium truncate">
            {session?.user?.name ?? "Admin"}
          </p>
          <p className="font-body text-white/40 text-xs truncate">
            {session?.user?.email}
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
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
        </form>
      </div>
    </nav>
  );
}

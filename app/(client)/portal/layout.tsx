// app/(client)/portal/layout.tsx
// Client portal shell layout — auth guard + client nav.
// Clean, professional layout that matches the public site's aesthetic
// without the admin sidebar.

import { redirect } from "next/navigation";
import Link         from "next/link";
import { auth, signOut } from "@/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/portal/login");
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Portal nav */}
      <header className="bg-navy border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/portal" className="flex flex-col leading-none">
            <span className="font-display text-base font-bold text-white tracking-wide">
              Premasse
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-gold font-body">
              Client portal
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link
              href="/portal"
              className="font-body text-white/60 hover:text-white text-sm transition-colors"
            >
              My requests
            </Link>
            <Link
              href="/portal/new"
              className="btn-gold font-body font-semibold text-navy text-sm px-4 py-2 rounded-sm"
            >
              New request
            </Link>

            {/* Account + sign out */}
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <Link
                href="/portal/account"
                className="font-body text-white/50 text-xs hover:text-white transition-colors truncate max-w-35"
              >
                {session.user.name ?? session.user.email}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/portal/login" });
                }}
              >
                <button
                  type="submit"
                  className="font-body text-white/35 text-xs hover:text-white transition-colors"
                  aria-label="Sign out"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 9.5L12 7l-3-2.5M12 7H5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}

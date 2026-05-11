// app/(admin)/layout.tsx
// Premium admin shell layout — auth guard + cinematic dashboard UI.

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Debug logging
  console.log("[AdminLayout] Session check:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    role: session?.user?.role,
    email: session?.user?.email,
  });

  if (!session?.user) {
    console.log(
      "[AdminLayout] No session — redirecting to /login"
    );

    redirect("/login");
  }

  if (
    session.user.role !== "ADMIN"
  ) {
    console.log(
      `[AdminLayout] User role is ${session.user.role}, not ADMIN — redirecting to /`
    );

    redirect("/");
  }

  console.log(
    "[AdminLayout] Access granted — rendering dashboard"
  );

  return (
    <div className="min-h-screen bg-[#041f19] overflow-hidden">

      {/* Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">

        {/* Gold glow */}
        <div className="absolute top-[-140px] left-[-120px] w-[500px] h-[500px] rounded-full bg-[#C9A84C]/10 blur-3xl animate-pulse" />

        {/* Emerald glow */}
        <div className="absolute bottom-[-220px] right-[-140px] w-[620px] h-[620px] rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",

            backgroundSize:
              "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">

        {/* Sidebar */}
        <DashboardNav session={session} />

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

          {/* Mobile topbar */}
          <div
            className="
              lg:hidden
              flex
              items-center
              justify-between
              px-5
              py-4
              border-b
              border-white/10
              bg-[#041f19]/80
              backdrop-blur-xl
            "
          >

            <span className="font-display text-white font-bold text-lg">
              Premasse
            </span>

            <span className="text-[#C9A84C] text-[11px] tracking-[0.22em] uppercase font-semibold">
              Admin dashboard
            </span>
          </div>

          {/* Main content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">

            <div className="relative z-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
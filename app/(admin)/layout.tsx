// app/(admin)/layout.tsx
// Admin shell layout — auth guard + sidebar navigation.

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Debug logging to see what's happening
  console.log("[AdminLayout] Session check:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    role: session?.user?.role,
    email: session?.user?.email,
  });

  if (!session?.user) {
    console.log("[AdminLayout] No session — redirecting to /login");
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    console.log(`[AdminLayout] User role is ${session.user.role}, not ADMIN — redirecting to /`);
    redirect("/");
  }

  console.log("[AdminLayout] Access granted — rendering dashboard");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar - DashboardNav handles both desktop and mobile */}
      <DashboardNav session={session} />

      {/* Page content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-green-dark border-b border-white/10">
          <span className="font-display text-white font-bold text-base">
            Premasse Admin
          </span>
          <span className="font-body text-gold text-xs tracking-widest uppercase">
            Dashboard
          </span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
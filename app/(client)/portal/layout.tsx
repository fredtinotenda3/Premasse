// app/(client)/portal/layout.tsx
// Client portal shell layout — auth guard + premium client nav.

import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import {
  ArrowUpRight,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "CLIENT"
  ) {
    redirect("/portal/login");
  }

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

      {/* NAVBAR */}
      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-white/10
          bg-[#041f19]/70
          backdrop-blur-2xl
        "
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-12 h-20 flex items-center justify-between">

          {/* Brand */}
          <Link
            href="/portal"
            className="flex items-center gap-4"
          >

            <div className="w-11 h-11 rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/10 flex items-center justify-center shadow-[0_10px_30px_rgba(201,168,76,0.12)]">

              <Sparkles className="w-5 h-5 text-[#C9A84C]" />
            </div>

            <div className="flex flex-col leading-none">

              <span className="font-display text-white text-xl font-bold tracking-wide">
                Premasse
              </span>

              <span className="text-[10px] tracking-[0.24em] uppercase text-[#C9A84C] font-medium mt-1">
                Client portal
              </span>
            </div>
          </Link>

          {/* Nav */}
          <div className="flex items-center gap-4 lg:gap-6">

            <Link
              href="/portal"
              className="
                text-white/60
                hover:text-white
                transition-colors
                duration-300
                text-sm
              "
            >
              My requests
            </Link>

            <Link
              href="/portal/new"
              className="
                group
                relative
                overflow-hidden
                bg-[#C9A84C]
                text-[#041f19]
                font-semibold
                px-5
                py-3
                rounded-2xl
                text-sm
                tracking-[0.12em]
                uppercase
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_20px_60px_rgba(201,168,76,0.35)]
                inline-flex
                items-center
                gap-2
              "
            >

              New request

              <ArrowUpRight className="w-4 h-4" />

              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>

            {/* Account */}
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">

              <Link
                href="/portal/account"
                className="
                  flex
                  items-center
                  gap-3
                  group
                "
              >

                <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-white/70 group-hover:text-white transition-colors">

                  <ShieldCheck className="w-4 h-4" />
                </div>

                <div className="hidden sm:flex flex-col leading-none">

                  <span className="text-white/85 text-sm font-medium truncate max-w-[180px]">
                    {session.user.name ??
                      session.user.email}
                  </span>

                  <span className="text-white/35 text-[10px] tracking-[0.18em] uppercase mt-1">
                    Client account
                  </span>
                </div>
              </Link>

              {/* Sign out */}
              <form
                action={async () => {
                  "use server";

                  await signOut({
                    redirectTo:
                      "/portal/login",
                  });
                }}
              >

                <button
                  type="submit"
                  className="
                    w-10
                    h-10
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                    text-white/45
                    hover:text-white
                    hover:border-[#C9A84C]/20
                    transition-all
                    duration-300
                  "
                  aria-label="Sign out"
                >

                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 py-10">

        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            p-6
            sm:p-8
            lg:p-10
            shadow-[0_40px_120px_rgba(0,0,0,0.25)]
          "
        >

          {/* Glow */}
          <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

          <div className="relative">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
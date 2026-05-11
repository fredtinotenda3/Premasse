// app/(client)/portal/account/page.tsx
// Premium client account settings page.

import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import PortalAccountForm from "@/components/portal/PortalAccountForm";

import {
  ShieldCheck,
  Sparkles,
  User2,
} from "lucide-react";

export const metadata: Metadata =
  {
    title:
      "Account — Premasse Portal",
  };

export const dynamic =
  "force-dynamic";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user)
    redirect("/portal/login");

  const user =
    await prisma.user.findUnique(
      {
        where: {
          id: session.user.id,
        },

        select: {
          name: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      }
    );

  if (!user)
    redirect("/portal/login");

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-10">

        <div className="inline-flex items-center gap-3 mb-6">

          <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

            <Sparkles className="w-4 h-4 text-[#C9A84C]" />

            <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
              Client account
            </span>
          </div>
        </div>

        <h1
          className="font-display text-white leading-[0.95] mb-4"
          style={{
            fontSize:
              "clamp(2.8rem, 5vw, 5rem)",

            letterSpacing:
              "-0.05em",
          }}
        >
          Account
          <br />

          <span className="text-[#C9A84C] italic">
            settings.
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
          Manage your personal information and keep your contact details up to date.
        </p>

        {/* Trust indicators */}
        <div className="flex flex-wrap gap-5 mt-8">

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />

            <span className="text-white/45 text-[11px] tracking-[0.18em] uppercase">
              Secure account
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />

            <span className="text-white/45 text-[11px] tracking-[0.18em] uppercase">
              Protected information
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C9A84C]" />

            <span className="text-white/45 text-[11px] tracking-[0.18em] uppercase">
              Client portal access
            </span>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

        {/* Main Form */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2.5rem]
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-2xl
            p-8
            sm:p-10
            shadow-[0_40px_120px_rgba(0,0,0,0.25)]
          "
        >

          {/* Glow */}
          <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

          <div className="relative">

            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 bg-[#C9A84C]" />

              <span className="text-[#C9A84C] text-xs tracking-[0.22em] uppercase font-semibold">
                Personal information
              </span>
            </div>

            <PortalAccountForm
              userId={
                session.user.id
              }
              defaultName={
                user.name
              }
              email={
                user.email
              }
              defaultPhone={
                user.phone ?? ""
              }
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">

          {/* Profile Summary */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-white/10
              bg-white/[0.03]
              backdrop-blur-xl
              p-8
              shadow-[0_30px_80px_rgba(0,0,0,0.2)]
            "
          >

            <div className="absolute top-[-80px] left-[-80px] w-[220px] h-[220px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

            <div className="relative">

              <div className="w-16 h-16 rounded-2xl border border-[#C9A84C]/20 bg-[#C9A84C]/10 flex items-center justify-center mb-6">

                <User2 className="w-7 h-7 text-[#C9A84C]" />
              </div>

              <h2 className="font-display text-white text-2xl mb-2 leading-tight">
                {user.name ??
                  "Portal user"}
              </h2>

              <p className="text-white/45 text-sm break-all mb-8">
                {user.email}
              </p>

              <div className="space-y-5">

                <div>
                  <p className="text-white/35 text-[11px] uppercase tracking-[0.18em] mb-1">
                    Member since
                  </p>

                  <p className="text-white text-sm">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString(
                      "en-ZW",
                      {
                        dateStyle:
                          "long",
                      }
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-white/35 text-[11px] uppercase tracking-[0.18em] mb-1">
                    Account type
                  </p>

                  <p className="text-white text-sm">
                    Client portal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-[#C9A84C]/20
              bg-[#C9A84C]/10
              backdrop-blur-xl
              p-8
              shadow-[0_30px_80px_rgba(0,0,0,0.2)]
            "
          >

            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/10 to-transparent" />

            <div className="relative">

              <h3 className="font-display text-white text-2xl leading-tight mb-4">
                Secure access
              </h3>

              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Your email address is used as your secure login identifier and cannot be changed from this page.
              </p>

              <div className="flex items-center gap-3">

                <ShieldCheck className="w-5 h-5 text-[#041f19]" />

                <span className="text-[#041f19] text-sm font-semibold">
                  Magic link authentication enabled
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
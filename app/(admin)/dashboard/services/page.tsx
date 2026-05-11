// app/(admin)/dashboard/services/page.tsx

import { Metadata } from "next";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";

import { ServiceCategory } from "@prisma/client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Sparkles,
  XCircle,
} from "lucide-react";

export const metadata: Metadata =
  {
    title:
      "Services — Admin",
  };

export const dynamic =
  "force-dynamic";

const CATEGORY_LABELS: Record<
  ServiceCategory,
  string
> = {
  TAX_ACCOUNTING:
    "Tax",

  COMPANY_REG:
    "Registration",

  ZIMRA_TAX_REG:
    "ZIMRA",

  TAX_CLEARANCE:
    "Clearance",

  SME_ACCOUNTING:
    "Accounting",

  STOCK_TAKING:
    "Stock-Taking",
};

// ─────────────────────────────────────────────────────────────
// Toggle service
// ─────────────────────────────────────────────────────────────

async function toggleService(
  formData: FormData
) {
  "use server";

  await requireAdmin();

  const id =
    formData.get(
      "id"
    ) as string;

  const isActive =
    formData.get(
      "isActive"
    ) === "true";

  await prisma.service.update(
    {
      where: { id },

      data: {
        isActive:
          !isActive,
      },
    }
  );

  revalidatePath(
    "/dashboard/services"
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default async function ServicesPage() {
  await requireAdmin();

  const services =
    await prisma.service.findMany(
      {
        orderBy: {
          sortOrder:
            "asc",
        },

        include: {
          _count: {
            select: {
              requests:
                true,
            },
          },
        },
      }
    );

  const activeCount =
    services.filter(
      (s) => s.isActive
    ).length;

  const inactiveCount =
    services.length -
    activeCount;

  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-10">

        <div className="inline-flex items-center gap-3 mb-6">

          <div className="flex items-center gap-2.5 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-5 py-2.5 backdrop-blur-md shadow-[0_10px_40px_rgba(201,168,76,0.08)]">

            <Sparkles className="w-4 h-4 text-[#C9A84C]" />

            <span className="font-body text-[#C9A84C] text-[11px] tracking-[0.24em] uppercase font-semibold">
              Services
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
          Service
          <br />

          <span className="text-[#C9A84C] italic">
            management.
          </span>
        </h1>

        <p className="text-white/60 text-base sm:text-lg max-w-2xl leading-relaxed">
          Configure, activate,
          and manage all public
          services offered on
          the Premasse
          platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

        <StatCard
          label="Total services"
          value={services.length}
          icon={
            BriefcaseBusiness
          }
        />

        <StatCard
          label="Active"
          value={activeCount}
          icon={
            CheckCircle2
          }
        />

        <StatCard
          label="Inactive"
          value={
            inactiveCount
          }
          icon={XCircle}
        />
      </div>

      {/* Mobile */}
      <div className="block lg:hidden space-y-5">

        {services.map(
          (service) => (
            <div
              key={service.id}
              className="
                group
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                p-5
                shadow-[0_30px_80px_rgba(0,0,0,0.18)]
                hover:border-[#C9A84C]/20
                hover:-translate-y-1
                transition-all
                duration-500
              "
            >

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-[#C9A84C]/5 via-transparent to-transparent" />

              <div className="relative">

                <div className="flex items-start justify-between gap-4 mb-5">

                  <div className="min-w-0">

                    <h3 className="text-white text-base font-medium">
                      {
                        service.name
                      }
                    </h3>

                    <p className="text-white/35 text-xs truncate mt-1">
                      /
                      {
                        service.slug
                      }
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold whitespace-nowrap ${
                      service.isActive
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                        : "border-white/10 bg-white/[0.04] text-white/45"
                    }`}
                  >
                    {service.isActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mb-5">

                  <div>

                    <p className="text-white/30 text-[10px] uppercase tracking-[0.18em] mb-2">
                      Category
                    </p>

                    <span className="inline-flex items-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/10 px-3 py-1 text-[#C9A84C] text-[10px] uppercase tracking-[0.16em] font-semibold">
                      {
                        CATEGORY_LABELS[
                          service
                            .category
                        ]
                      }
                    </span>
                  </div>

                  <div>

                    <p className="text-white/30 text-[10px] uppercase tracking-[0.18em] mb-2">
                      Price
                    </p>

                    <p className="text-white/70 text-sm">
                      {service.price
                        ? `$${service.price.toFixed(
                            2
                          )}`
                        : "Quote-based"}
                    </p>
                  </div>

                  <div>

                    <p className="text-white/30 text-[10px] uppercase tracking-[0.18em] mb-2">
                      Requests
                    </p>

                    <p className="text-white text-sm">
                      {
                        service
                          ._count
                          .requests
                      }
                    </p>
                  </div>
                </div>

                <form
                  action={
                    toggleService
                  }
                >

                  <input
                    type="hidden"
                    name="id"
                    value={
                      service.id
                    }
                  />

                  <input
                    type="hidden"
                    name="isActive"
                    value={String(
                      service.isActive
                    )}
                  />

                  <button
                    type="submit"
                    className="
                      w-full
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      px-4
                      py-3
                      text-white/70
                      hover:text-white
                      hover:border-[#C9A84C]/20
                      transition-all
                      duration-300
                    "
                  >

                    {service.isActive
                      ? "Deactivate service"
                      : "Activate service"}

                    <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
                  </button>
                </form>
              </div>
            </div>
          )
        )}
      </div>

      {/* Desktop */}
      <div
        className="
          hidden
          lg:block
          relative
          overflow-hidden
          rounded-[2.5rem]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-2xl
          shadow-[0_40px_120px_rgba(0,0,0,0.22)]
        "
      >

        <div className="absolute top-[-100px] right-[-100px] w-[260px] h-[260px] rounded-full bg-[#C9A84C]/10 blur-3xl" />

        <div className="relative overflow-x-auto">

          <table className="w-full min-w-[980px]">

            <thead>

              <tr className="border-b border-white/10">

                {[
                  "Service",
                  "Category",
                  "Price",
                  "Requests",
                  "Status",
                  "",
                ].map(
                  (h) => (
                    <th
                      key={h}
                      className="
                        text-left
                        text-white/35
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        px-8
                        py-5
                      "
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">

              {services.map(
                (
                  service
                ) => (
                  <tr
                    key={
                      service.id
                    }
                    className="group hover:bg-white/[0.02] transition-colors duration-300"
                  >

                    {/* Service */}
                    <td className="px-8 py-6">

                      <p className="text-white text-sm font-medium mb-1">
                        {
                          service.name
                        }
                      </p>

                      <p className="text-white/35 text-xs truncate max-w-[240px]">
                        /
                        {
                          service.slug
                        }
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-8 py-6">

                      <span className="inline-flex items-center rounded-full border border-[#C9A84C]/20 bg-[#C9A84C]/10 px-3 py-1 text-[#C9A84C] text-[10px] uppercase tracking-[0.16em] font-semibold whitespace-nowrap">
                        {
                          CATEGORY_LABELS[
                            service
                              .category
                          ]
                        }
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-8 py-6">

                      <p className="text-white/70 text-sm">
                        {service.price
                          ? `$${service.price.toFixed(
                              2
                            )}`
                          : "Quote-based"}
                      </p>
                    </td>

                    {/* Requests */}
                    <td className="px-8 py-6">

                      <p className="text-white text-sm">
                        {
                          service
                            ._count
                            .requests
                        }
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-8 py-6">

                      <span
                        className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] font-semibold whitespace-nowrap ${
                          service.isActive
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                            : "border-white/10 bg-white/[0.04] text-white/45"
                        }`}
                      >
                        {service.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-8 py-6 text-right">

                      <form
                        action={
                          toggleService
                        }
                      >

                        <input
                          type="hidden"
                          name="id"
                          value={
                            service.id
                          }
                        />

                        <input
                          type="hidden"
                          name="isActive"
                          value={String(
                            service.isActive
                          )}
                        />

                        <button
                          type="submit"
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.03]
                            px-4
                            py-2.5
                            text-white/60
                            hover:text-white
                            hover:border-[#C9A84C]/20
                            transition-all
                            duration-300
                          "
                        >

                          {service.isActive
                            ? "Deactivate"
                            : "Activate"}

                          <ArrowRight className="w-4 h-4 text-[#C9A84C]" />
                        </button>
                      </form>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <p className="text-white/30 text-xs mt-5 px-1 leading-relaxed">
        Deactivating a service
        hides it from the
        public website and
        request forms.
        Existing client
        requests remain
        unaffected.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-white/10
        bg-white/[0.03]
        backdrop-blur-xl
        p-6
        shadow-[0_30px_80px_rgba(0,0,0,0.18)]
        hover:border-[#C9A84C]/20
        hover:-translate-y-1
        transition-all
        duration-500
      "
    >

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#C9A84C]/10 to-transparent" />

      <div className="relative">

        <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center mb-8">

          <Icon className="w-6 h-6 text-[#C9A84C]" />
        </div>

        <p className="font-display text-white text-4xl leading-none mb-3">
          {value}
        </p>

        <p className="text-white/55 text-sm uppercase tracking-[0.16em]">
          {label}
        </p>
      </div>
    </div>
  );
}
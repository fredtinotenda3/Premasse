// app/(admin)/dashboard/services/page.tsx
// Admin services management — view all services, toggle active/inactive.
// Full CRUD (create/edit) can be added in a future iteration.

import { Metadata }    from "next";
import { prisma }      from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidatePath } from "next/cache";
import { ServiceCategory } from "@prisma/client";

export const metadata: Metadata = { title: "Services — Admin" };
export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  TAX_ACCOUNTING:  "Tax",
  COMPANY_REG:     "Registration",
  ZIMRA_TAX_REG:   "ZIMRA",
  TAX_CLEARANCE:   "Clearance",
  SME_ACCOUNTING:  "Accounting",
};

// ── Server action: toggle isActive ────────────────────────────────────────────

async function toggleService(formData: FormData) {
  "use server";
  await requireAdmin();

  const id       = formData.get("id")       as string;
  const isActive = formData.get("isActive") === "true";

  await prisma.service.update({
    where: { id },
    data:  { isActive: !isActive },
  });

  revalidatePath("/dashboard/services");
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ServicesPage() {
  await requireAdmin();

  const services = await prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { requests: true } },
    },
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-navy text-xl sm:text-2xl font-semibold mb-1">
          Services
        </h1>
        <p className="font-body text-slate/60 text-sm">
          {services.length} service{services.length !== 1 ? "s" : ""} configured.
          Toggle active/inactive to show or hide from the public site.
        </p>
      </div>

      {/* Mobile card view - visible on small screens */}
      <div className="block sm:hidden space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white border border-gray-100 rounded-sm p-4 hover:shadow-md transition-shadow duration-200"
          >
            {/* Service name and slug */}
            <div className="mb-3">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-body text-navy text-sm font-semibold flex-1">
                  {service.name}
                </h3>
                <span
                  className={`inline-block font-body font-semibold text-[10px] px-2.5 py-1 rounded-sm border uppercase tracking-widest ml-2 shrink-0 ${
                    service.isActive
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="font-body text-slate/40 text-xs truncate">
                /{service.slug}
              </p>
            </div>

            {/* Category and Price */}
            <div className="grid grid-cols-2 gap-3 mb-3 pt-2 border-t border-gray-50">
              <div>
                <p className="font-body text-slate/40 text-[10px] uppercase tracking-wider mb-1">
                  Category
                </p>
                <span className="font-body text-[10px] tracking-[0.15em] uppercase font-semibold text-gold border border-gold/30 px-2 py-0.5 rounded-sm inline-block">
                  {CATEGORY_LABELS[service.category]}
                </span>
              </div>
              <div>
                <p className="font-body text-slate/40 text-[10px] uppercase tracking-wider mb-1">
                  Price
                </p>
                <p className="font-body text-slate/60 text-sm">
                  {service.price ? `$${service.price.toFixed(2)}` : "Quote-based"}
                </p>
              </div>
            </div>

            {/* Requests and Action */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div>
                <p className="font-body text-slate/40 text-[10px] uppercase tracking-wider mb-1">
                  Total requests
                </p>
                <p className="font-body text-slate/60 text-sm">
                  {service._count.requests}
                </p>
              </div>
              <form action={toggleService}>
                <input type="hidden" name="id" value={service.id} />
                <input type="hidden" name="isActive" value={String(service.isActive)} />
                <button
                  type="submit"
                  className="font-body text-xs text-slate/50 border border-gray-200 hover:border-gray-300 hover:text-navy px-3 py-1.5 rounded-sm transition-colors duration-150"
                >
                  {service.isActive ? "Deactivate" : "Activate"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table view - hidden on mobile */}
      <div className="hidden sm:block">
        <div className="bg-white border border-gray-100 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-3xl">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Service", "Category", "Price", "Requests", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="font-body text-left text-xs text-slate/50 font-medium uppercase tracking-widest px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50/60 transition-colors duration-100">
                    {/* Name */}
                    <td className="px-5 py-4">
                      <p className="font-body text-navy text-sm font-medium">
                        {service.name}
                      </p>
                      <p className="font-body text-slate/40 text-xs truncate max-w-55 mt-0.5">
                        /{service.slug}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="font-body text-[10px] tracking-[0.15em] uppercase font-semibold text-gold border border-gold/30 px-2 py-0.5 rounded-sm whitespace-nowrap">
                        {CATEGORY_LABELS[service.category]}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <p className="font-body text-slate/60 text-sm">
                        {service.price ? `$${service.price.toFixed(2)}` : "Quote-based"}
                      </p>
                    </td>

                    {/* Request count */}
                    <td className="px-5 py-4">
                      <p className="font-body text-slate/60 text-sm">
                        {service._count.requests}
                      </p>
                    </td>

                    {/* Active badge */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block font-body font-semibold text-[10px] px-2.5 py-1 rounded-sm border uppercase tracking-widest whitespace-nowrap ${
                          service.isActive
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Toggle action */}
                    <td className="px-5 py-4 text-right">
                      <form action={toggleService}>
                        <input type="hidden" name="id" value={service.id} />
                        <input type="hidden" name="isActive" value={String(service.isActive)} />
                        <button
                          type="submit"
                          className="font-body text-xs text-slate/50 border border-gray-200 hover:border-gray-300 hover:text-navy px-3 py-1.5 rounded-sm transition-colors duration-150 whitespace-nowrap"
                        >
                          {service.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info note */}
      <p className="font-body text-slate/40 text-xs mt-4 px-1">
        Deactivating a service hides it from the public services page and request form.
        Existing requests for that service are not affected.
      </p>
    </div>
  );
}
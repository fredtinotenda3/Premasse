// app/(client)/portal/new/page.tsx
// Authenticated new request form.
// Pre-fills client name and email from session — no re-entry needed.
// Reuses the existing ServiceRequestForm component.

import { Metadata }  from "next";
import { redirect }  from "next/navigation";
import { auth }      from "@/auth";
import { prisma }    from "@/lib/prisma";
import PortalRequestForm from "@/components/portal/PortalRequestForm";

export const metadata: Metadata = { title: "New request — Premasse Portal" };
export const revalidate = 60;

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: { service?: string };
}) {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  const services = await prisma.service.findMany({
    where:   { isActive: true },
    orderBy: { sortOrder: "asc" },
    select:  { id: true, name: true, slug: true, category: true, description: true, price: true },
  });

  const preselected = searchParams.service
    ? services.find((s) => s.slug === searchParams.service)?.id
    : undefined;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-navy text-2xl font-semibold mb-1">
          New request
        </h1>
        <p className="font-body text-slate/60 text-sm">
          We&apos;ll respond within one business day.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm p-8">
        <PortalRequestForm
          services={services}
          preselectedServiceId={preselected}
          defaultName={session.user.name  ?? ""}
          defaultEmail={session.user.email ?? ""}
        />
      </div>
    </div>
  );
}

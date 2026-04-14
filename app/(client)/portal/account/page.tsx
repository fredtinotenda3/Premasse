// app/(client)/portal/account/page.tsx
// Client account settings — update name and phone number.
// Email cannot be changed (it's the login identifier).

import { Metadata }  from "next";
import { redirect }  from "next/navigation";
import { auth }      from "@/auth";
import { prisma }    from "@/lib/prisma";
import PortalAccountForm from "@/components/portal/PortalAccountForm";

export const metadata: Metadata = { title: "Account — Premasse Portal" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/portal/login");

  const user = await prisma.user.findUnique({
    where:  { id: session.user.id },
    select: { name: true, email: true, phone: true, createdAt: true },
  });

  if (!user) redirect("/portal/login");

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="font-display text-navy text-2xl font-semibold mb-1">
          Account
        </h1>
        <p className="font-body text-slate/60 text-sm">
          Update your contact details.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-sm p-8">
        <PortalAccountForm
          userId={session.user.id}
          defaultName={user.name}
          email={user.email}
          defaultPhone={user.phone ?? ""}
        />
      </div>

      <div className="mt-4 bg-gray-50 border border-gray-100 rounded-sm p-4">
        <p className="font-body text-slate/50 text-xs">
          Member since {new Date(user.createdAt).toLocaleDateString("en-ZW", { dateStyle: "long" })}
        </p>
      </div>
    </div>
  );
}

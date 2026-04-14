// app/(public)/request/page.tsx

import { Metadata }  from "next";
import { prisma }    from "@/lib/prisma";
import Navbar        from "@/components/layout/Navbar";
import Footer        from "@/components/layout/Footer";
import ServiceRequestFormWithUpload from "@/components/forms/ServiceRequestFormWithUpload";

export const metadata: Metadata = {
  title: "Request a Service",
  description:
    "Submit a service request to Premasse Business Services. We'll be in touch within one business day.",
};

export const revalidate = 60;

export default async function RequestPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: serviceSlug } = await searchParams;

  const services = await prisma.service.findMany({
    where:   { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: {
      id:          true,
      name:        true,
      slug:        true,
      category:    true,
      description: true,
      price:       true,
    },
  });

  const preselected = serviceSlug
    ? services.find((s) => s.slug === serviceSlug)?.id
    : undefined;

  return (
    <>
      <Navbar />
      <main className="bg-cream min-h-screen pt-20">

        {/* Page header */}
        <div className="bg-navy py-16 px-6">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-xs tracking-[0.25em] uppercase font-body font-medium">
                Get started
              </span>
            </div>
            <h1 className="font-display text-white text-4xl md:text-5xl leading-tight mb-4">
              Request a service
            </h1>
            <p className="font-body text-white/60 text-lg leading-relaxed max-w-xl">
              Fill in the form below and one of our registered practitioners
              will contact you within one business day.
            </p>
          </div>
        </div>

        {/* Form + sidebar */}
        <div className="mx-auto max-w-6xl px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Form — 2/3 */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-100 rounded-sm p-8 md:p-10">
                <h2 className="font-display text-navy text-2xl font-semibold mb-2">
                  Service request
                </h2>
                <p className="font-body text-slate text-sm mb-8">
                  Fields marked <span className="text-gold">*</span> are required.
                </p>

                <ServiceRequestFormWithUpload
                  services={services}
                  preselectedServiceId={preselected}
                />
              </div>
            </div>

            {/* Sidebar — 1/3 */}
            <aside className="space-y-6">

              {/* What happens next */}
              <div className="bg-white border border-gray-100 rounded-sm p-6">
                <h3 className="font-display text-navy text-lg font-semibold mb-5">
                  What happens next
                </h3>
                <ol className="space-y-5">
                  {[
                    { step: "1", title: "We review your request",  body: "A registered practitioner reads your submission and assesses what's needed." },
                    { step: "2", title: "We contact you",          body: "Within one business day, we'll reach out via email or phone to discuss next steps." },
                    { step: "3", title: "We get it done",           body: "Once engaged, we handle all preparation, submission, and follow-up with ZIMRA or the relevant authority." },
                  ].map(({ step, title, body }) => (
                    <li key={step} className="flex gap-4">
                      <span className="font-display text-gold text-xl font-bold leading-none shrink-0 w-5">
                        {step}
                      </span>
                      <div>
                        <p className="font-body text-navy text-sm font-medium mb-1">{title}</p>
                        <p className="font-body text-slate/70 text-xs leading-relaxed">{body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Direct contact fallback */}
              <div className="bg-gold-pale border border-gold/20 rounded-sm p-6">
                <h3 className="font-display text-navy text-base font-semibold mb-2">
                  Prefer to call?
                </h3>
                <p className="font-body text-slate text-sm leading-relaxed mb-4">
                  You can also reach us directly during business hours.
                </p>
                <a
                  href="mailto:info@premasse.co.zw"
                  className="font-body text-navy text-sm font-medium underline underline-offset-2 decoration-gold hover:decoration-2 transition-all"
                >
                  info@premasse.co.zw
                </a>
              </div>

              {/* Available services list */}
              <div className="bg-white border border-gray-100 rounded-sm p-6">
                <h3 className="font-display text-navy text-base font-semibold mb-4">
                  Available services
                </h3>
                <ul className="space-y-2">
                  {services.map((s) => (
                    <li key={s.id} className="flex items-center gap-2 font-body text-slate text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

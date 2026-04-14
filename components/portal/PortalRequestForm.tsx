"use client";

// components/portal/PortalRequestForm.tsx
// Authenticated version of the request form.
// Key difference from the public form: submits with userId in session,
// so the request is linked to the client's account immediately.
// Name and email are pre-filled and locked from the session.

import { useState }    from "react";
import { useForm }     from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter }   from "next/navigation";
import { z }           from "zod";

const schema = z.object({
  serviceId: z.string().min(1, "Please select a service").cuid(),
  notes:     z.string().min(10, "Please provide at least a brief description").max(2000).trim(),
});

type Fields = z.infer<typeof schema>;

type Service = {
  id: string; name: string; slug: string;
  category: string; description: string; price: number | null;
};

type Props = {
  services:             Service[];
  preselectedServiceId?: string;
  defaultName:          string;
  defaultEmail:         string;
};

export default function PortalRequestForm({
  services,
  preselectedServiceId,
  defaultName,
  defaultEmail,
}: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { serviceId: preselectedServiceId ?? "" },
  });

  async function onSubmit(data: Fields) {
    setServerError("");

    const res  = await fetch("/api/requests", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        ...data,
        clientName:  defaultName,
        clientEmail: defaultEmail,
        clientPhone: "",
      }),
    });
    const json = await res.json();

    if (!json.success) {
      setServerError(json.error ?? "Submission failed.");
      return;
    }

    // Redirect to the new request's detail page
    router.push(`/portal/requests/${json.requestId}?submitted=1`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

      {/* Pre-filled client info — read-only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border border-gray-100 rounded-sm p-4">
        <div>
          <p className="font-body text-slate/40 text-xs uppercase tracking-wider mb-1">Name</p>
          <p className="font-body text-navy text-sm">{defaultName || "—"}</p>
        </div>
        <div>
          <p className="font-body text-slate/40 text-xs uppercase tracking-wider mb-1">Email</p>
          <p className="font-body text-navy text-sm">{defaultEmail}</p>
        </div>
        <p className="font-body text-slate/40 text-xs sm:col-span-2">
          Your contact details are taken from your account.{" "}
          <a href="/portal/account" className="underline underline-offset-2">Update them here.</a>
        </p>
      </div>

      {/* Service select */}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">
          Service required <span className="text-gold">*</span>
        </label>
        <select
          {...register("serviceId")}
          className={inputCls(!!errors.serviceId)}
          defaultValue={preselectedServiceId ?? ""}
        >
          <option value="" disabled>Select a service…</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        {errors.serviceId && (
          <p className="font-body text-red-600 text-xs">{errors.serviceId.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">
          Tell us about your situation <span className="text-gold">*</span>
        </label>
        <textarea
          {...register("notes")}
          rows={5}
          placeholder="e.g. I need to register a new private limited company and obtain a BP number before end of month…"
          className={`${inputCls(!!errors.notes)} resize-none`}
        />
        {errors.notes && (
          <p className="font-body text-red-600 text-xs">{errors.notes.message}</p>
        )}
      </div>

      {/* Error */}
      {serverError && (
        <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 flex gap-2 items-start">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-500 shrink-0 mt-0.5">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 4v3M7 9.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="font-body text-red-700 text-sm">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-gold w-full font-body font-semibold text-navy px-8 py-4 rounded-sm text-base tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Submitting…" : "Submit request"}
      </button>

      <p className="font-body text-slate/50 text-xs text-center">
        You&apos;ll be able to upload supporting documents after submitting.
      </p>
    </form>
  );
}

function inputCls(err: boolean) {
  return [
    "font-body text-navy text-sm w-full bg-white border rounded-sm px-4 py-3",
    "placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors",
    err
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-gold focus:ring-gold/20",
  ].join(" ");
}

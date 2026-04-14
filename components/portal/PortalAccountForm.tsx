"use client";

// components/portal/PortalAccountForm.tsx
// Updates the client's name and phone via a PATCH to /api/portal/account.

import { useState } from "react";
import { useForm }  from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z }        from "zod";

const schema = z.object({
  name:  z.string().min(2, "Name must be at least 2 characters").trim(),
  phone: z
    .string()
    .regex(/^(\+263|0)[0-9]{9}$/, "Enter a valid Zimbabwean number")
    .optional()
    .or(z.literal("")),
});

type Fields = z.infer<typeof schema>;

type Props = {
  userId:       string;
  defaultName:  string;
  email:        string;
  defaultPhone: string;
};

export default function PortalAccountForm({
  userId, defaultName, email, defaultPhone,
}: Props) {
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Fields>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName, phone: defaultPhone },
  });

  async function onSubmit(data: Fields) {
    setSaved(false);
    setError("");

    const res  = await fetch("/api/portal/account", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...data, userId }),
    });
    const json = await res.json();

    if (!json.success) {
      setError(json.error ?? "Update failed.");
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Email — read-only */}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">
          Email address
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="font-body text-slate/50 text-sm w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 cursor-not-allowed"
        />
        <p className="font-body text-slate/40 text-xs">
          Email cannot be changed — it&apos;s your sign-in identifier.
        </p>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">
          Full name <span className="text-gold">*</span>
        </label>
        <input
          {...register("name")}
          type="text"
          autoComplete="name"
          className={inputCls(!!errors.name)}
        />
        {errors.name && (
          <p className="font-body text-red-600 text-xs">{errors.name.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-navy text-sm font-medium">
          Phone number
          <span className="font-normal text-slate/40 ml-1">(optional)</span>
        </label>
        <input
          {...register("phone")}
          type="tel"
          placeholder="+263 77 123 4567"
          autoComplete="tel"
          className={inputCls(!!errors.phone)}
        />
        {errors.phone && (
          <p className="font-body text-red-600 text-xs">{errors.phone.message}</p>
        )}
      </div>

      {/* Feedback */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-3 flex gap-2 items-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-green-600 shrink-0">
            <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="font-body text-green-800 text-sm">Details updated.</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3">
          <p className="font-body text-red-700 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="btn-gold font-body font-semibold text-navy px-6 py-3 rounded-sm text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving…" : "Save changes"}
      </button>
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

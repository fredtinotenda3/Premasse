"use client";

// components/forms/ServiceRequestForm.tsx
// Client component — uses React Hook Form + Zod resolver.
// Receives `services` as a prop (fetched server-side on the page).

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serviceRequestSchema,
  type ServiceRequestInput,
  type ServiceRequestResponse,
} from "@/validators/request.schema";

// ── Types ─────────────────────────────────────────────────────────────────────

type Service = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number | null;
};

type Props = {
  services: Service[];
  preselectedServiceId?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

// ── Component ─────────────────────────────────────────────────────────────────

export default function ServiceRequestForm({
  services,
  preselectedServiceId,
}: Props) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [requestId, setRequestId] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceId: preselectedServiceId ?? "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    },
  });

  // ── Submit handler ──────────────────────────────────────────────────────────

  const onSubmit = async (data: ServiceRequestInput) => {
    setSubmitState("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json: ServiceRequestResponse = await res.json();

      if (!json.success) {
        // Map server-side field errors back onto the form
        if (json.fieldErrors) {
          Object.entries(json.fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof ServiceRequestInput, {
              message: messages[0],
            });
          });
        }
        setServerMessage(json.error);
        setSubmitState("error");
        return;
      }

      setRequestId(json.requestId);
      setServerMessage(json.message);
      setSubmitState("success");
      reset();
    } catch {
      setServerMessage(
        "A network error occurred. Please check your connection and try again."
      );
      setSubmitState("error");
    }
  };

  // ── Success state ───────────────────────────────────────────────────────────

  if (submitState === "success") {
    return (
      <div className="bg-white border border-green-200 rounded-sm p-10 text-center">
        {/* Checkmark */}
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-green-600"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h3 className="font-display text-navy text-2xl font-semibold mb-3">
          Request received
        </h3>
        <p className="font-body text-slate text-base leading-relaxed mb-2 max-w-sm mx-auto">
          {serverMessage}
        </p>
        {requestId && (
          <p className="font-body text-slate/60 text-xs mt-4">
            Reference: <span className="font-mono">{requestId}</span>
          </p>
        )}

        <button
          onClick={() => {
            setSubmitState("idle");
            setServerMessage("");
            setRequestId("");
          }}
          className="mt-8 font-body text-navy border border-navy/25 hover:border-navy transition-colors duration-200 px-6 py-2.5 rounded-sm text-sm"
        >
          Submit another request
        </button>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

      {/* Service select */}
      <Field label="Service required" error={errors.serviceId?.message} required>
        <select
          {...register("serviceId")}
          className={inputCls(!!errors.serviceId)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a service…
          </option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      {/* Name + Email side by side on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Field label="Full name" error={errors.clientName?.message} required>
          <input
            {...register("clientName")}
            type="text"
            placeholder="Tatenda Moyo"
            autoComplete="name"
            className={inputCls(!!errors.clientName)}
          />
        </Field>

        <Field label="Email address" error={errors.clientEmail?.message} required>
          <input
            {...register("clientEmail")}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls(!!errors.clientEmail)}
          />
        </Field>
      </div>

      {/* Phone */}
      <Field
        label="Phone number"
        error={errors.clientPhone?.message}
        hint="Optional — Zimbabwean numbers only (e.g. +263 77 123 4567)"
      >
        <input
          {...register("clientPhone")}
          type="tel"
          placeholder="+263 77 123 4567"
          autoComplete="tel"
          className={inputCls(!!errors.clientPhone)}
        />
      </Field>

      {/* Notes */}
      <Field
        label="Tell us about your situation"
        error={errors.notes?.message}
        hint="The more detail you provide, the faster we can help."
        required
      >
        <textarea
          {...register("notes")}
          rows={5}
          placeholder="e.g. I need to register a new private limited company and get a BP number before the end of the month…"
          className={`${inputCls(!!errors.notes)} resize-none`}
        />
      </Field>

      {/* Server error banner */}
      {submitState === "error" && serverMessage && (
        <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 flex gap-3 items-start">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-red-500 shrink-0 mt-0.5"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M8 5v3.5M8 11h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="font-body text-red-700 text-sm leading-relaxed">
            {serverMessage}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-gold w-full font-body font-semibold text-navy px-8 py-4 rounded-sm text-base tracking-wide disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner />
            Submitting…
          </span>
        ) : (
          "Submit request"
        )}
      </button>

      <p className="font-body text-slate/60 text-xs text-center leading-relaxed">
        We respond within one business day. Your information is kept strictly
        confidential.
      </p>
    </form>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-navy text-sm font-medium">
        {label}
        {required && (
          <span className="text-gold ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="font-body text-slate/60 text-xs">{hint}</p>
      )}
      {error && (
        <p className="font-body text-red-600 text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="animate-spin"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M14 8a6 6 0 00-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Shared input class builder ─────────────────────────────────────────────────

function inputCls(hasError: boolean): string {
  return [
    "font-body text-navy text-sm w-full",
    "bg-white border rounded-sm px-4 py-3",
    "placeholder:text-slate/40",
    "focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-150",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-gold focus:ring-gold/20",
  ]
    .filter(Boolean)
    .join(" ");
}

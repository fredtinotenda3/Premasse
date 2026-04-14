"use client";

// components/forms/ServiceRequestFormWithUpload.tsx
// Extends the base ServiceRequestForm with an optional document upload step.
// Two-step flow: (1) submit request → get requestId → (2) optionally upload docs.
// Replaces ServiceRequestForm on the /request page in Phase 3.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serviceRequestSchema,
  type ServiceRequestInput,
  type ServiceRequestResponse,
} from "@/validators/request.schema";
import DocumentUploader from "./DocumentUploader";

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

type Step = "form" | "upload" | "done";

export default function ServiceRequestFormWithUpload({
  services,
  preselectedServiceId,
}: Props) {
  const [step,          setStep]          = useState<Step>("form");
  const [requestId,     setRequestId]     = useState<string>("");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [submitError,   setSubmitError]   = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestInput>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      serviceId:   preselectedServiceId ?? "",
      clientName:  "",
      clientEmail: "",
      clientPhone: "",
      notes:       "",
    },
  });

  // ── Step 1: submit request ──────────────────────────────────────────────────

  const onSubmit = async (data: ServiceRequestInput) => {
    setSubmitError("");

    const res  = await fetch("/api/requests", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(data),
    });
    const json: ServiceRequestResponse = await res.json();

    if (!json.success) {
      if (json.fieldErrors) {
        Object.entries(json.fieldErrors).forEach(([field, messages]) => {
          setError(field as keyof ServiceRequestInput, { message: messages[0] });
        });
      }
      setSubmitError(json.error);
      return;
    }

    setRequestId(json.requestId);
    setServerMessage(json.message);
    setStep("upload");
  };

  // ── Step 2: upload docs (optional) ─────────────────────────────────────────

  if (step === "upload") {
    return (
      <div className="space-y-6">
        {/* Success confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-sm px-4 py-4 flex gap-3 items-start">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-green-600 shrink-0 mt-0.5">
            <path d="M2.5 8l4 4 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="font-body text-green-800 text-sm font-medium mb-0.5">
              Request submitted
            </p>
            <p className="font-body text-green-700/70 text-xs">{serverMessage}</p>
          </div>
        </div>

        {/* Upload section */}
        <div>
          <h3 className="font-display text-navy text-lg font-semibold mb-1">
            Upload supporting documents
          </h3>
          <p className="font-body text-slate/60 text-sm mb-5">
            Optional — attach any relevant documents (ID, existing registration
            certificates, previous tax returns, etc.) to help us process your
            request faster.
          </p>

          <DocumentUploader
            requestId={requestId}
            maxFiles={10}
            showDeleteButton={false}
          />
        </div>

        {/* Skip / finish */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setStep("done")}
            className="font-body text-slate/50 text-sm hover:text-navy transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={() => setStep("done")}
            className="btn-gold font-body font-semibold text-navy px-6 py-2.5 rounded-sm text-sm tracking-wide"
          >
            Done — finish submission
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3: all done ────────────────────────────────────────────────────────

  if (step === "done") {
    return (
      <div className="bg-white border border-green-200 rounded-sm p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-green-600">
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="font-display text-navy text-2xl font-semibold mb-3">
          All done
        </h3>
        <p className="font-body text-slate text-base leading-relaxed max-w-sm mx-auto mb-2">
          {serverMessage}
        </p>
        {requestId && (
          <p className="font-body text-slate/50 text-xs mt-4">
            Reference: <span className="font-mono">{requestId}</span>
          </p>
        )}
      </div>
    );
  }

  // ── Step 1: request form ────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <Field label="Service required" error={errors.serviceId?.message} required>
        <select
          {...register("serviceId")}
          className={inputCls(!!errors.serviceId)}
          defaultValue=""
        >
          <option value="" disabled>Select a service…</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </Field>

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

      <Field
        label="Tell us about your situation"
        error={errors.notes?.message}
        hint="The more detail you provide, the faster we can help."
        required
      >
        <textarea
          {...register("notes")}
          rows={5}
          placeholder="e.g. I need to register a new private limited company…"
          className={`${inputCls(!!errors.notes)} resize-none`}
        />
      </Field>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-sm px-4 py-3 flex gap-3 items-start">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-red-500 shrink-0 mt-0.5">
            <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7.5 4.5v3M7.5 10h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p className="font-body text-red-700 text-sm leading-relaxed">{submitError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-gold w-full font-body font-semibold text-navy px-8 py-4 rounded-sm text-base tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner /> Submitting…
          </span>
        ) : (
          "Submit request"
        )}
      </button>

      <p className="font-body text-slate/60 text-xs text-center">
        You&apos;ll be able to attach documents after submitting.
      </p>
    </form>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function Field({ label, error, hint, required, children }: {
  label: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-navy text-sm font-medium">
        {label}
        {required && <span className="text-gold ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="font-body text-slate/60 text-xs">{hint}</p>}
      {error && <p className="font-body text-red-600 text-xs" role="alert">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function inputCls(hasError: boolean): string {
  return [
    "font-body text-navy text-sm w-full bg-white border rounded-sm px-4 py-3",
    "placeholder:text-slate/40 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-gray-200 focus:border-gold focus:ring-gold/20",
  ].join(" ");
}

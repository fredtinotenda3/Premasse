"use client";

// components/forms/ServiceRequestFormWithUpload.tsx

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

type Step =
  | "form"
  | "upload"
  | "done";

export default function ServiceRequestFormWithUpload({
  services,
  preselectedServiceId,
}: Props) {
  const [step, setStep] =
    useState<Step>("form");

  const [requestId, setRequestId] =
    useState<string>("");

  const [
    serverMessage,
    setServerMessage,
  ] = useState<string>("");

  const [
    submitError,
    setSubmitError,
  ] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ServiceRequestInput>({
    resolver:
      zodResolver(
        serviceRequestSchema
      ),

    defaultValues: {
      serviceId:
        preselectedServiceId ?? "",

      clientName: "",
      clientEmail: "",
      clientPhone: "",
      notes: "",
    },
  });

  // ─────────────────────────────────────────────────────────────
  // Submit Request
  // ─────────────────────────────────────────────────────────────

  const onSubmit = async (
    data: ServiceRequestInput
  ) => {
    setSubmitError("");

    const res = await fetch(
      "/api/requests",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(data),
      }
    );

    const json: ServiceRequestResponse =
      await res.json();

    if (!json.success) {
      if (json.fieldErrors) {
        Object.entries(
          json.fieldErrors
        ).forEach(
          ([field, messages]) => {
            setError(
              field as keyof ServiceRequestInput,
              {
                message: messages[0],
              }
            );
          }
        );
      }

      setSubmitError(json.error);
      return;
    }

    setRequestId(json.requestId);

    setServerMessage(json.message);

    setStep("upload");
  };

  // ─────────────────────────────────────────────────────────────
  // Upload Step
  // ─────────────────────────────────────────────────────────────

  if (step === "upload") {
    return (
      <div className="space-y-8">

        {/* Success */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-5 flex gap-4 items-start">

          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">

            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-emerald-400"
            >
              <path
                d="M2.5 8l4 4 7-7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <p className="text-white text-sm font-medium mb-1">
              Request submitted
            </p>

            <p className="text-white/65 text-sm">
              {serverMessage}
            </p>
          </div>
        </div>

        {/* Upload */}
        <div>

          <h3 className="font-display text-white text-2xl mb-2">
            Upload supporting documents
          </h3>

          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Optional — attach any relevant documents such as IDs,
            certificates, previous returns, or registration files to
            help us process your request faster.
          </p>

          <DocumentUploader
            requestId={requestId}
            maxFiles={10}
            showDeleteButton={false}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">

          <button
            onClick={() =>
              setStep("done")
            }
            className="
              text-white/45
              hover:text-white
              transition-colors
              duration-300
              text-sm
            "
          >
            Skip for now
          </button>

          <button
            onClick={() =>
              setStep("done")
            }
            className="
              group
              relative
              overflow-hidden
              bg-[#C9A84C]
              text-[#041f19]
              font-semibold
              px-6
              py-3
              rounded-2xl
              text-sm
              tracking-[0.14em]
              uppercase
              transition-all
              duration-500
              hover:-translate-y-1
              hover:shadow-[0_20px_60px_rgba(201,168,76,0.35)]
            "
          >
            Done — finish submission
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Done Step
  // ─────────────────────────────────────────────────────────────

  if (step === "done") {
    return (
      <div
        className="
          rounded-[2rem]
          border
          border-emerald-500/20
          bg-white/[0.03]
          backdrop-blur-xl
          p-10
          text-center
        "
      >

        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">

          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-emerald-400"
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

        <h3 className="font-display text-white text-3xl mb-4">
          All done
        </h3>

        <p className="text-white/65 text-base leading-relaxed max-w-sm mx-auto mb-2">
          {serverMessage}
        </p>

        {requestId && (
          <p className="text-white/35 text-xs mt-5">
            Reference:{" "}

            <span className="font-mono">
              {requestId}
            </span>
          </p>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Form
  // ─────────────────────────────────────────────────────────────

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      noValidate
      className="space-y-6"
    >

      {/* Service */}
      <Field
        label="Service required"
        error={
          errors.serviceId?.message
        }
        required
      >

        <select
          {...register(
            "serviceId"
          )}
          className={inputCls(
            !!errors.serviceId
          )}
          defaultValue=""
        >

          <option
            value=""
            disabled
            className="bg-[#041f19] text-white"
          >
            Select a service…
          </option>

          {services.map((s) => (
            <option
              key={s.id}
              value={s.id}
              className="bg-[#041f19] text-white"
            >
              {s.name}
            </option>
          ))}
        </select>
      </Field>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        <Field
          label="Full name"
          error={
            errors.clientName?.message
          }
          required
        >

          <input
            {...register(
              "clientName"
            )}
            type="text"
            placeholder="Tatenda Moyo"
            autoComplete="name"
            className={inputCls(
              !!errors.clientName
            )}
          />
        </Field>

        <Field
          label="Email address"
          error={
            errors.clientEmail
              ?.message
          }
          required
        >

          <input
            {...register(
              "clientEmail"
            )}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className={inputCls(
              !!errors.clientEmail
            )}
          />
        </Field>
      </div>

      {/* Phone */}
      <Field
        label="Phone number"
        error={
          errors.clientPhone?.message
        }
        hint="Optional — Zimbabwean numbers only (e.g. +263 77 123 4567)"
      >

        <input
          {...register(
            "clientPhone"
          )}
          type="tel"
          placeholder="+263 77 123 4567"
          autoComplete="tel"
          className={inputCls(
            !!errors.clientPhone
          )}
        />
      </Field>

      {/* Notes */}
      <Field
        label="Tell us about your situation"
        error={
          errors.notes?.message
        }
        hint="The more detail you provide, the faster we can help."
        required
      >

        <textarea
          {...register("notes")}
          rows={5}
          placeholder="e.g. I need to register a new private limited company…"
          className={`${inputCls(
            !!errors.notes
          )} resize-none`}
        />
      </Field>

      {/* Error */}
      {submitError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 flex gap-4 items-start">

          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            className="text-red-400 shrink-0 mt-0.5"
          >
            <circle
              cx="7.5"
              cy="7.5"
              r="6.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />

            <path
              d="M7.5 4.5v3M7.5 10h.01"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <p className="text-red-300 text-sm leading-relaxed">
            {submitError}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          group
          relative
          overflow-hidden
          w-full
          bg-[#C9A84C]
          text-[#041f19]
          font-semibold
          px-8
          py-4
          rounded-2xl
          text-sm
          tracking-[0.16em]
          uppercase
          text-center
          transition-all
          duration-500
          hover:-translate-y-1
          hover:shadow-[0_20px_60px_rgba(201,168,76,0.35)]
          disabled:opacity-60
          disabled:cursor-not-allowed
        "
      >

        <span className="relative z-10 flex items-center justify-center gap-3">

          {isSubmitting ? (
            <>
              <Spinner />
              Submitting…
            </>
          ) : (
            "Submit request"
          )}
        </span>

        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>

      <p className="text-white/35 text-xs text-center">
        You&apos;ll be able to attach documents after submitting.
      </p>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Field
// ─────────────────────────────────────────────────────────────

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
    <div className="flex flex-col gap-2">

      <label className="text-white text-sm font-medium">

        {label}

        {required && (
          <span className="text-[#C9A84C] ml-1">
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && (
        <p className="text-white/35 text-xs">
          {hint}
        </p>
      )}

      {error && (
        <p
          className="text-red-300 text-xs"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Spinner
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// Input Classes
// ─────────────────────────────────────────────────────────────

function inputCls(
  hasError: boolean
): string {
  return [
    `
      w-full
      rounded-2xl
      border
      bg-white/[0.03]
      backdrop-blur-md
      px-5
      py-4
      text-white
      placeholder:text-white/30
      transition-all
      duration-300
      outline-none
    `,

    hasError
      ? `
          border-red-400/30
          focus:border-red-400
          focus:ring-4
          focus:ring-red-400/10
        `
      : `
          border-white/10
          focus:border-[#C9A84C]/40
          focus:ring-4
          focus:ring-[#C9A84C]/10
        `,
  ].join(" ");
}
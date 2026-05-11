"use client";

// components/portal/PortalRequestForm.tsx
// Premium authenticated portal request form.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  serviceId: z
    .string()
    .min(
      1,
      "Please select a service"
    )
    .cuid(),

  notes: z
    .string()
    .min(
      10,
      "Please provide at least a brief description"
    )
    .max(2000)
    .trim(),
});

type Fields = z.infer<
  typeof schema
>;

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
  defaultName: string;
  defaultEmail: string;
};

export default function PortalRequestForm({
  services,
  preselectedServiceId,
  defaultName,
  defaultEmail,
}: Props) {
  const router = useRouter();

  const [
    serverError,
    setServerError,
  ] = useState("");

  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<Fields>({
    resolver:
      zodResolver(schema),

    defaultValues: {
      serviceId:
        preselectedServiceId ??
        "",
    },
  });

  async function onSubmit(
    data: Fields
  ) {
    setServerError("");

    const res = await fetch(
      "/api/requests",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ...data,

          clientName:
            defaultName,

          clientEmail:
            defaultEmail,

          clientPhone: "",
        }),
      }
    );

    const json =
      await res.json();

    if (!json.success) {
      setServerError(
        json.error ??
          "Submission failed."
      );

      return;
    }

    router.push(
      `/portal/requests/${json.requestId}?submitted=1`
    );
  }

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      noValidate
      className="space-y-7"
    >

      {/* Client info */}
      <div
        className="
          rounded-[2rem]
          border
          border-white/10
          bg-white/[0.03]
          backdrop-blur-md
          p-6
        "
      >

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <div>

            <p className="text-white/35 text-[11px] uppercase tracking-[0.18em] mb-2">
              Name
            </p>

            <p className="text-white text-sm">
              {defaultName ||
                "—"}
            </p>
          </div>

          <div>

            <p className="text-white/35 text-[11px] uppercase tracking-[0.18em] mb-2">
              Email
            </p>

            <p className="text-white text-sm break-all">
              {defaultEmail}
            </p>
          </div>
        </div>

        <p className="text-white/35 text-xs leading-relaxed mt-5">

          Your contact details are linked to your portal account.{" "}

          <a
            href="/portal/account"
            className="
              text-[#C9A84C]
              hover:text-white
              transition-colors
              duration-300
              underline
              underline-offset-2
            "
          >
            Update them here.
          </a>
        </p>
      </div>

      {/* Service */}
      <div className="flex flex-col gap-2">

        <label className="text-white text-sm font-medium">

          Service required

          <span className="text-[#C9A84C] ml-1">
            *
          </span>
        </label>

        <select
          {...register(
            "serviceId"
          )}
          className={inputCls(
            !!errors.serviceId
          )}
          defaultValue={
            preselectedServiceId ??
            ""
          }
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

        {errors.serviceId && (
          <p className="text-red-300 text-xs">
            {
              errors
                .serviceId
                .message
            }
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">

        <label className="text-white text-sm font-medium">

          Tell us about your situation

          <span className="text-[#C9A84C] ml-1">
            *
          </span>
        </label>

        <textarea
          {...register(
            "notes"
          )}
          rows={6}
          placeholder="e.g. I need to register a new private limited company and obtain a BP number before end of month…"
          className={`${inputCls(
            !!errors.notes
          )} resize-none`}
        />

        {errors.notes && (
          <p className="text-red-300 text-xs">
            {
              errors.notes
                .message
            }
          </p>
        )}
      </div>

      {/* Error */}
      {serverError && (
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
            {serverError}
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

          {isSubmitting
            ? "Submitting…"
            : "Submit request"}
        </span>

        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>

      <p className="text-white/35 text-xs text-center">
        You&apos;ll be able to upload supporting documents after submitting.
      </p>
    </form>
  );
}

function inputCls(
  err: boolean
) {
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
      text-sm
      placeholder:text-white/30
      transition-all
      duration-300
      outline-none
    `,

    err
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
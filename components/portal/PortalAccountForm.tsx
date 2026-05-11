"use client";

// components/portal/PortalAccountForm.tsx
// Premium portal account form.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(
      2,
      "Name must be at least 2 characters"
    )
    .trim(),

  phone: z
    .string()
    .regex(
      /^(\+263|0)[0-9]{9}$/,
      "Enter a valid Zimbabwean number"
    )
    .optional()
    .or(z.literal("")),
});

type Fields = z.infer<
  typeof schema
>;

type Props = {
  userId: string;
  defaultName: string;
  email: string;
  defaultPhone: string;
};

export default function PortalAccountForm({
  userId,
  defaultName,
  email,
  defaultPhone,
}: Props) {
  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
  } = useForm<Fields>({
    resolver:
      zodResolver(schema),

    defaultValues: {
      name: defaultName,
      phone: defaultPhone,
    },
  });

  async function onSubmit(
    data: Fields
  ) {
    setSaved(false);
    setError("");

    const res = await fetch(
      "/api/portal/account",
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          ...data,
          userId,
        }),
      }
    );

    const json =
      await res.json();

    if (!json.success) {
      setError(
        json.error ??
          "Update failed."
      );

      return;
    }

    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-7"
    >

      {/* Email */}
      <div className="flex flex-col gap-2">

        <label className="text-white text-sm font-medium">
          Email address
        </label>

        <input
          type="email"
          value={email}
          disabled
          className="
            w-full
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            backdrop-blur-md
            px-5
            py-4
            text-white/45
            text-sm
            cursor-not-allowed
          "
        />

        <p className="text-white/30 text-xs leading-relaxed">
          Your email address cannot be changed because it is used as your secure login identifier.
        </p>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-2">

        <label className="text-white text-sm font-medium">

          Full name

          <span className="text-[#C9A84C] ml-1">
            *
          </span>
        </label>

        <input
          {...register("name")}
          type="text"
          autoComplete="name"
          placeholder="Tatenda Moyo"
          className={inputCls(
            !!errors.name
          )}
        />

        {errors.name && (
          <p className="text-red-300 text-xs">
            {
              errors.name
                .message
            }
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-2">

        <label className="text-white text-sm font-medium">

          Phone number

          <span className="text-white/30 font-normal ml-1">
            (optional)
          </span>
        </label>

        <input
          {...register("phone")}
          type="tel"
          placeholder="+263 77 123 4567"
          autoComplete="tel"
          className={inputCls(
            !!errors.phone
          )}
        />

        {errors.phone && (
          <p className="text-red-300 text-xs">
            {
              errors.phone
                .message
            }
          </p>
        )}
      </div>

      {/* Success */}
      {saved && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 flex gap-4 items-start">

          <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">

            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-emerald-400"
            >
              <path
                d="M2 7l4 4 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>

            <p className="text-emerald-200 text-sm font-medium mb-1">
              Details updated
            </p>

            <p className="text-emerald-100/70 text-sm leading-relaxed">
              Your account information has been saved successfully.
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
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
            {error}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={
          isSubmitting ||
          !isDirty
        }
        className="
          group
          relative
          overflow-hidden
          bg-[#C9A84C]
          text-[#041f19]
          font-semibold
          px-8
          py-4
          rounded-2xl
          text-sm
          tracking-[0.16em]
          uppercase
          transition-all
          duration-500
          hover:-translate-y-1
          hover:shadow-[0_20px_60px_rgba(201,168,76,0.35)]
          disabled:opacity-50
          disabled:cursor-not-allowed
          disabled:hover:translate-y-0
          w-full
          sm:w-auto
        "
      >

        <span className="relative z-10 flex items-center justify-center gap-3">

          {isSubmitting
            ? "Saving…"
            : "Save changes"}
        </span>

        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Input Classes
// ─────────────────────────────────────────────────────────────

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
"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex flex-col leading-none group relative z-50">
      <span className="font-display text-xl font-bold text-white tracking-wide">
        Premasse
      </span>
      <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-body font-medium">
        Business Services
      </span>
    </Link>
  );
}
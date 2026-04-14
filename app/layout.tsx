import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Premasse Business Services",
    template: "%s | Premasse Business Services",
  },
  description:
    "Registered tax accountants and business services specialists in Zimbabwe. Company registration, ZIMRA tax registration, tax clearance, and SME accounting.",
  keywords: [
    "tax accountant Zimbabwe",
    "company registration Zimbabwe",
    "ZIMRA registration",
    "tax clearance certificate",
    "SME accounting Harare",
  ],
  openGraph: {
    title: "Premasse Business Services",
    description:
      "Professional tax and business services in Zimbabwe. Trusted by SMEs across Harare.",
    type: "website",
    locale: "en_ZW",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <body className="bg-white font-body antialiased">{children}</body>
    </html>
  );
}

// app/layout.tsx
// Root layout with comprehensive SEO metadata.
// Includes Open Graph, Twitter cards, canonical URLs, and JSON-LD structured data.

import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const playfair = Playfair_Display({
  subsets:  ["latin"],
  variable: "--font-display",
  display:  "swap",
});

const dmSans = DM_Sans({
  subsets:  ["latin"],
  variable: "--font-body",
  display:  "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://premasse.co.zw";

// ── Root metadata ─────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:  "Premasse Business Services | Tax & Company Registration Zimbabwe",
    template: "%s | Premasse Business Services",
  },

  description:
    "Registered tax accountants in Harare, Zimbabwe. Company registration, ZIMRA tax registration, ITF263 tax clearance certificates, and SME accounting. Get started in minutes.",

  keywords: [
    // High-intent local search terms
    "tax clearance certificate Zimbabwe",
    "company registration Zimbabwe",
    "ZIMRA registration Zimbabwe",
    "tax accountant Harare",
    "company registration Harare",
    "ITF263 tax clearance",
    "ZIMRA BP number registration",
    "SME accounting Zimbabwe",
    "registered tax accountant Zimbabwe",
    "PAAB accountant Zimbabwe",
    "tax consultant Harare",
    "VAT registration Zimbabwe",
    "PAYE registration Zimbabwe",
    "company registration COBE",
  ],

  authors:  [{ name: "Premasse Business Services", url: SITE_URL }],
  creator:  "Premasse Business Services",
  publisher:"Premasse Business Services",

  // Canonical + alternate
  alternates: {
    canonical: SITE_URL,
  },

  // Open Graph — for WhatsApp, Facebook, LinkedIn link previews
  openGraph: {
    type:        "website",
    locale:      "en_ZW",
    url:         SITE_URL,
    siteName:    "Premasse Business Services",
    title:       "Premasse Business Services | Tax & Company Registration Zimbabwe",
    description: "Registered tax accountants in Harare. Company registration, ZIMRA tax registration, tax clearance (ITF263), and SME accounting. Serving Zimbabwean businesses.",
    images: [
      {
        url:    `${SITE_URL}/og-image.png`,
        width:  1200,
        height: 630,
        alt:    "Premasse Business Services — Tax Accountants Zimbabwe",
      },
    ],
  },

  // Twitter / X card
  twitter: {
    card:        "summary_large_image",
    title:       "Premasse Business Services | Tax & Company Registration Zimbabwe",
    description: "Registered tax accountants in Harare. Company registration, ZIMRA registration, tax clearance, SME accounting.",
    images:      [`${SITE_URL}/og-image.png`],
  },

  // Verification (add once you verify in Google Search Console)
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },

  // Prevent AI crawlers from training on content
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
};

// ── JSON-LD Structured Data ───────────────────────────────────────────────────
// Tells Google exactly what kind of business this is — enables rich results.

const structuredData = {
  "@context": "https://schema.org",
  "@type":    "AccountingService",
  name:       "Premasse Business Services",
  url:        SITE_URL,
  logo:       `${SITE_URL}/logo.png`,
  image:      `${SITE_URL}/og-image.png`,
  description:
    "Registered tax accountants and business services specialists in Zimbabwe. Company registration, ZIMRA tax registration, ITF263 tax clearance certificates, and SME accounting services.",
  telephone:    "",
  email:        "info@premasse.co.zw",
  priceRange:   "$$",
  currenciesAccepted: "USD, ZWL",
  paymentAccepted:    "Cash, EcoCash, OneMoney, Bank Transfer",
  areaServed: {
    "@type": "Country",
    name:    "Zimbabwe",
  },
  address: {
    "@type":           "PostalAddress",
    addressLocality:   "Harare",
    addressRegion:     "Harare",
    addressCountry:    "ZW",
  },
  openingHoursSpecification: [
    {
      "@type":     "OpeningHoursSpecification",
      dayOfWeek:   ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens:       "08:00",
      closes:      "17:00",
    },
  ],
  sameAs: [],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name:    "Business Services",
    itemListElement: [
      {
        "@type":       "Offer",
        itemOffered: {
          "@type":       "Service",
          name:          "Company Registration Zimbabwe",
          description:   "End-to-end company registration under COBE including name reservation, certificate of incorporation, and CR14.",
          url:           `${SITE_URL}/services/company-registration`,
        },
      },
      {
        "@type":       "Offer",
        itemOffered: {
          "@type":       "Service",
          name:          "Tax Clearance Certificate Zimbabwe (ITF263)",
          description:   "Obtain your ZIMRA ITF263 Tax Clearance Certificate quickly for tenders, contracts, and business transactions.",
          url:           `${SITE_URL}/services/tax-clearance`,
        },
      },
      {
        "@type":       "Offer",
        itemOffered: {
          "@type":       "Service",
          name:          "ZIMRA Tax Registration Zimbabwe",
          description:   "BP number, VAT, and PAYE registration with ZIMRA for businesses in Zimbabwe.",
          url:           `${SITE_URL}/services/zimra-tax-registration`,
        },
      },
      {
        "@type":       "Offer",
        itemOffered: {
          "@type":       "Service",
          name:          "SME Accounting Services Zimbabwe",
          description:   "Monthly bookkeeping, management accounts, payroll processing, and annual financial statements for Zimbabwean SMEs.",
          url:           `${SITE_URL}/services/sme-accounting`,
        },
      },
    ],
  },
};

// ── Layout ────────────────────────────────────────────────────────────────────

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
      <head>
        {/* JSON-LD structured data for Google rich results */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-white font-body antialiased">{children}</body>
    </html>
  );
}

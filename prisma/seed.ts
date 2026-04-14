// prisma/seed.ts
// Premasse Business Services — Database Seed
// Run with: npx prisma db seed

import { PrismaClient, Role, ServiceCategory } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// ─────────────────────────────────────────
// DEBUG LOGGER
// Structured, timestamped debug output.
// Set DEBUG=true in your .env to enable.
// ─────────────────────────────────────────

const DEBUG = process.env.DEBUG === "true";

function log(level: "info" | "debug" | "warn" | "error", message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const prefix = {
    info:  "  ✓",
    debug: "  →",
    warn:  "  ⚠",
    error: "  ✗",
  }[level];

  if (level === "debug" && !DEBUG) return;

  console.log(`${prefix} [${timestamp}] ${message}`);
  if (data !== undefined && DEBUG) {
    console.log("    ", JSON.stringify(data, null, 2));
  }
}

async function main() {
  console.log("🌱 Seeding Premasse database...");
  console.log(`   ENV: ${process.env.NODE_ENV ?? "development"}`);
  console.log(`   DEBUG: ${DEBUG ? "on" : "off (set DEBUG=true to enable)"}`);
  console.log("");

  // ─────────────────────────────────────────
  // SERVICES
  // ─────────────────────────────────────────

  console.log("── Services ──────────────────────────────");

  const services = [
    {
      name: "Registered Tax Accountant Consultation",
      slug: "tax-accountant-consultation",
      description:
        "One-on-one consultation with a registered tax accountant. We review your financial position, advise on tax obligations, and help you make informed decisions for your business or personal tax affairs.",
      category: ServiceCategory.TAX_ACCOUNTING,
      price: null,
      sortOrder: 1,
    },
    {
      name: "Company Registration",
      slug: "company-registration",
      description:
        "Full end-to-end company registration with ZIMRA and the Companies and Other Business Entities Act (COBE). Includes name reservation, certificate of incorporation, and CR14 documentation.",
      category: ServiceCategory.COMPANY_REG,
      price: null,
      sortOrder: 2,
    },
    {
      name: "ZIMRA / Tax Registration",
      slug: "zimra-tax-registration",
      description:
        "Register your business for tax purposes with ZIMRA. Covers BP number registration, VAT registration, and PAYE registration for businesses with employees.",
      category: ServiceCategory.ZIMRA_TAX_REG,
      price: null,
      sortOrder: 3,
    },
    {
      name: "Tax Clearance Certificate",
      slug: "tax-clearance",
      description:
        "Obtain your ZIMRA Tax Clearance Certificate (ITF263) quickly and correctly. Required for tendering, contract work, and business transactions in Zimbabwe.",
      category: ServiceCategory.TAX_CLEARANCE,
      price: null,
      sortOrder: 4,
    },
    {
      name: "Accounting Services for SMEs",
      slug: "sme-accounting",
      description:
        "Ongoing accounting support tailored for small and medium enterprises. Includes bookkeeping, monthly management accounts, payroll processing, and annual financial statements.",
      category: ServiceCategory.SME_ACCOUNTING,
      price: null,
      sortOrder: 5,
    },
  ];

  log("debug", `Preparing to upsert ${services.length} services`);

  let servicesCreated = 0;
  let servicesUpdated = 0;

  for (const service of services) {
    log("debug", `Checking existing record for slug: "${service.slug}"`);

    const existing = await prisma.service.findUnique({
      where: { slug: service.slug },
    });

    if (existing) {
      log("debug", `Found existing service id=${existing.id} — will update`);
    } else {
      log("debug", `No existing record found — will create`);
    }

    const result = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        name: service.name,
        description: service.description,
        category: service.category,
        price: service.price,
        sortOrder: service.sortOrder,
        isActive: true,
      },
      create: {
        ...service,
        isActive: true,
      },
    });

    if (existing) {
      servicesUpdated++;
      log("info", `Updated service: "${result.name}" (id=${result.id})`);
    } else {
      servicesCreated++;
      log("info", `Created service: "${result.name}" (id=${result.id})`);
    }

    log("debug", `Service record`, {
      id: result.id,
      slug: result.slug,
      category: result.category,
      isActive: result.isActive,
      sortOrder: result.sortOrder,
    });
  }

  console.log("");
  log("info", `Services done — created: ${servicesCreated}, updated: ${servicesUpdated}`);

  // ─────────────────────────────────────────
  // ADMIN USER
  // ─────────────────────────────────────────

  console.log("");
  console.log("── Admin user ────────────────────────────");

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@premasse.co.zw";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  log("debug", `Admin email resolved to: ${adminEmail}`);
  log(
    "debug",
    `Password source: ${
      process.env.SEED_ADMIN_PASSWORD
        ? "SEED_ADMIN_PASSWORD env var"
        : "hardcoded default — override in .env!"
    }`
  );

  if (!process.env.SEED_ADMIN_PASSWORD) {
    log("warn", "SEED_ADMIN_PASSWORD not set — using default. Set it in .env before production!");
  }

  log("debug", "Hashing admin password (bcrypt, 12 rounds)...");
  const hashStart = Date.now();
  const hashedPassword = await hash(adminPassword, 12);
  log("debug", `Password hashed in ${Date.now() - hashStart}ms`);

  log("debug", `Checking if admin already exists: ${adminEmail}`);
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { accounts: true },
  });

  if (existingAdmin) {
    log(
      "debug",
      `Existing admin found — id=${existingAdmin.id}, linked accounts=${existingAdmin.accounts.length}`
    );
  } else {
    log("debug", "No existing admin — will create with linked credentials account");
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Premasse Admin",
      email: adminEmail,
      role: Role.ADMIN,
      accounts: {
        create: {
          type: "credentials",
          provider: "credentials",
          providerAccountId: adminEmail,
          access_token: hashedPassword,
        },
      },
    },
  });

  log(
    "info",
    `${existingAdmin ? "Skipped (already exists)" : "Created"} admin: ${admin.email} (id=${admin.id})`
  );
  log("debug", "Admin record", {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
  });

  // ─────────────────────────────────────────
  // SAMPLE SERVICE REQUEST (dev only)
  // ─────────────────────────────────────────

  if (process.env.NODE_ENV !== "production") {
    console.log("");
    console.log("── Sample request (dev only) ─────────────");

    log("debug", 'Looking up service with slug "tax-clearance"');
    const taxClearance = await prisma.service.findUnique({
      where: { slug: "tax-clearance" },
    });

    if (!taxClearance) {
      log("warn", 'Service "tax-clearance" not found — skipping sample request');
    } else {
      log("debug", `Found service: id=${taxClearance.id}, name="${taxClearance.name}"`);

      const existing = await prisma.serviceRequest.findFirst({
        where: { clientEmail: "testclient@example.com" },
      });

      if (existing) {
        log("info", `Sample request already exists (id=${existing.id}) — skipping`);
        log("debug", "Existing request", {
          id: existing.id,
          status: existing.status,
          createdAt: existing.createdAt,
        });
      } else {
        log("debug", "No existing sample request — creating now");

        const sampleRequest = await prisma.serviceRequest.create({
          data: {
            serviceId: taxClearance.id,
            clientName: "Tatenda Moyo",
            clientEmail: "testclient@example.com",
            clientPhone: "+263 77 123 4567",
            notes:
              "I need a tax clearance certificate urgently for a government tender closing end of month. My BP number is 1234567.",
            status: "PENDING",
            auditLogs: {
              create: {
                changedBy: admin.id,
                fromStatus: null,
                toStatus: "PENDING",
                note: "Request submitted via website",
              },
            },
          },
          include: {
            auditLogs: true,
          },
        });

        log("info", `Created sample request (id=${sampleRequest.id})`);
        log("debug", "Sample request", {
          id: sampleRequest.id,
          serviceId: sampleRequest.serviceId,
          clientName: sampleRequest.clientName,
          clientEmail: sampleRequest.clientEmail,
          status: sampleRequest.status,
          auditLogsCreated: sampleRequest.auditLogs.length,
        });
      }
    }
  } else {
    log("debug", "NODE_ENV=production — skipping sample request block");
  }

  // ─────────────────────────────────────────
  // FINAL SUMMARY
  // ─────────────────────────────────────────

  console.log("");
  console.log("── Summary ───────────────────────────────");

  const [totalServices, totalUsers, totalRequests] = await Promise.all([
    prisma.service.count(),
    prisma.user.count(),
    prisma.serviceRequest.count(),
  ]);

  log("info", `Services in DB:  ${totalServices}`);
  log("info", `Users in DB:     ${totalUsers}`);
  log("info", `Requests in DB:  ${totalRequests}`);

  console.log("");
  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("\n❌ Seed failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    log("debug", "Disconnecting Prisma client");
    await prisma.$disconnect();
  });
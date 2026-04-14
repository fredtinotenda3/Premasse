// auth.ts
// NextAuth v5 — Admin credentials + Client magic link via Resend.

import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider               from "next-auth/providers/credentials";
import { PrismaAdapter }                 from "@auth/prisma-adapter";
import { compare }                       from "bcryptjs";
import { prisma }                        from "@/lib/prisma";
import { z }                             from "zod";
import { Resend }                        from "resend";

// ── Type extensions ───────────────────────────────────────────────────────────

declare module "next-auth" {
  interface Session {
    user: {
      id:   string;
      role: "ADMIN" | "CLIENT";
    } & DefaultSession["user"];
  }
  interface User {
    role: "ADMIN" | "CLIENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id:   string;
    role: "ADMIN" | "CLIENT";
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const credentialsSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
});

const resend = new Resend(process.env.RESEND_API_KEY);

// ── NextAuth config ───────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },

  pages: {
    signIn:        "/login",
    error:         "/login",
    verifyRequest: "/portal/verify",
  },

  providers: [
    // ── Admin: email + password ───────────────────────────────────────────────
    CredentialsProvider({
      id:   "credentials",
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where:   { email },
          include: {
            accounts: {
              where:  { provider: "credentials" },
              select: { access_token: true },
            },
          },
        });

        if (!user || user.role !== "ADMIN") return null;

        const hashedPassword = user.accounts[0]?.access_token;
        if (!hashedPassword) return null;

        const match = await compare(password, hashedPassword);
        if (!match) return null;

        console.info(`[auth] Admin login: ${email}`);
        return {
          id:    user.id,
          name:  user.name,
          email: user.email,
          role:  user.role,
        };
      },
    }),

    // ── Client: magic link via Resend ─────────────────────────────────────────
    {
      id:     "email",
      name:   "Email",
      type:   "email" as const,
      from:   process.env.EMAIL_FROM ?? "Premasse <onboarding@resend.dev>",
      server: {},
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({
        identifier: email,
        url,
      }: {
        identifier: string;
        url:        string;
      }) {
        // Only send magic links to existing CLIENT accounts
        const user = await prisma.user.findUnique({
          where:  { email },
          select: { role: true },
        });
        if (!user || user.role !== "CLIENT") return;

        const { error } = await resend.emails.send({
          from:    process.env.EMAIL_FROM ?? "Premasse <onboarding@resend.dev>",
          to:      [email],
          subject: "Your Premasse sign-in link",
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px">
              <h2 style="color:#0A2540;font-size:22px;margin-bottom:8px">Sign in to Premasse</h2>
              <p style="color:#4A5568;font-size:15px;line-height:1.6;margin-bottom:28px">
                Click the button below to sign in to your Premasse client portal.
                This link expires in 24 hours and can only be used once.
              </p>
              <a href="${url}"
                style="display:inline-block;background:#0A2540;color:#C9A84C;font-weight:600;
                       padding:14px 28px;border-radius:2px;text-decoration:none;font-size:14px">
                Sign in to portal →
              </a>
              <p style="color:#9CA3AF;font-size:12px;margin-top:28px">
                If you didn't request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });

        if (error) {
          console.error("[auth] Magic link email failed:", error);
          throw new Error("Failed to send sign-in email");
        }

        console.info(`[auth] Magic link sent to: ${email}`);
      },
    },
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id   ?? token.id;
        token.role = user.role ?? token.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id   = token.id   as string;
        session.user.role = token.role as "ADMIN" | "CLIENT";
      }
      return session;
    },
  },
});
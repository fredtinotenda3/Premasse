// auth.ts
import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Resend } from "resend";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CLIENT";
    } & DefaultSession["user"];
  }
  interface User {
    role: "ADMIN" | "CLIENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "ADMIN" | "CLIENT";
  }
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  debug: true,

  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/portal/verify",
  },

  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            accounts: {
              where: { provider: "credentials" },
              select: { access_token: true },
            },
          },
        });

        if (!user || user.role !== "ADMIN") return null;

        const hashedPassword = user.accounts[0]?.access_token;
        if (!hashedPassword) return null;

        const match = await compare(password, hashedPassword);
        if (!match) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    {
      id: "email",
      name: "Email",
      type: "email" as const,
      from: process.env.EMAIL_FROM ?? "Premasse <onboarding@resend.dev>",
      server: {},
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier: email, url }) {
        console.log(`📧 Sending magic link to: ${email}`);
        
        // Check if user exists and is CLIENT
        const user = await prisma.user.findUnique({
          where: { email },
          select: { role: true, name: true },
        });

        if (!user) {
          console.log(`❌ No user found for: ${email}`);
          return;
        }

        if (user.role !== "CLIENT") {
          console.log(`❌ User ${email} has role ${user.role}, not CLIENT`);
          return;
        }

        console.log(`✅ Sending magic link to CLIENT: ${email}`);

        const { error } = await resend.emails.send({
          from: process.env.EMAIL_FROM ?? "Premasse <onboarding@resend.dev>",
          to: [email],
          subject: "🔐 Your Premasse sign-in link",
          html: `
            <div style="font-family: sans-serif; max-width: 500px; padding: 20px;">
              <h1 style="color: #1B5E20;">Premasse</h1>
              <p style="color: #C9A84C;">Business Services</p>
              
              <h2>Sign in to your account</h2>
              
              <p>Hello ${user.name?.split(" ")[0] ?? "there"},</p>
              
              <p>Click the button below to sign in to your Premasse client portal.</p>
              
              <a href="${url}" 
                 style="display: inline-block; background-color: #1B5E20; color: #C9A84C; 
                        padding: 12px 24px; text-decoration: none; border-radius: 4px;
                        margin: 20px 0;">
                Sign in to portal →
              </a>
              
              <p>This link expires in 24 hours.</p>
              
              <hr />
              <p style="color: #666; font-size: 12px;">Premasse Business Services · Harare, Zimbabwe</p>
            </div>
          `,
        });

        if (error) {
          console.error(`❌ Failed to send magic link to ${email}:`, error);
          throw new Error("Failed to send sign-in email");
        }

        console.log(`✅ Magic link sent to: ${email}`);
      },
    },
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "CLIENT";
      }
      return session;
    },
  },
});
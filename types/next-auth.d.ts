// types/next-auth.d.ts
// Augments the built-in next-auth types with Premasse-specific fields.
// TypeScript picks this up automatically — no import needed.
// Keeps session.user.id and session.user.role fully typed across the app.

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "CLIENT";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "ADMIN" | "CLIENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id:   string;
    role: "ADMIN" | "CLIENT";
  }
}
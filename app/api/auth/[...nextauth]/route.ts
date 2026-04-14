// app/api/auth/[...nextauth]/route.ts
// NextAuth v5 route handler.
// All auth endpoints (/api/auth/signin, /api/auth/signout, /api/auth/session,
// /api/auth/csrf, /api/auth/callback/...) are handled here automatically.
// Do not add logic here — all config lives in /auth.ts at the project root.

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
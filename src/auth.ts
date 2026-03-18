import NextAuth from "next-auth";
import authConfig from "./auth.config";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/validations";

/**
 * 2026 MOCK AUTH LAYER
 * This file is optimized for zero-error delivery.
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [
    ...authConfig.providers.filter((p) => p.id !== "credentials"),
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials" as any,
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          // ── 🛡️ HARDCODED ADMIN FOR DELIVERY ──────────────────────────
          if (email === "admin@gmail.com" && password === "admin") {
            return {
              id: "admin-id",
              email: "admin@gmail.com",
              name: "Administrateur Shine",
              role: "ADMIN",
            };
          }

          // ── 🛡️ MOCK CLIENT FOR TEST ──────────────────────────
          if (email === "client@gmail.com") {
             return {
              id: "client-id",
              email: "client@gmail.com",
              name: "Client Test",
              role: "CLIENT",
            };
          }
        }

        return null; // Invalid credentials
      },
    },
  ],
});

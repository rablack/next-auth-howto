// This file exports the various artifacts created by
// passing a configuration to NextAuth.
//
// By convention this file is called auth.ts and it lives
// in the project root. However neither of these appears
// to be required.
//
// This file is adapted from the AuthJS Testing
// documentation (an extremely useful page):
// https://authjs.dev/guides/testing

import NextAuth, { User } from "next-auth";
import { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { authConfig } from "./auth.config";

type CredentialField = "email" | "password";

interface CredentialFieldInfo {
  label: string; // The HTML label
  type: string; // The HTML input type
}

const providers: Provider[] = [GitHub];

if (process.env.NODE_ENV === "development") {
  providers.push(
    Credentials<Record<CredentialField, CredentialFieldInfo>>({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: (
        credentials: Partial<Record<CredentialField, unknown>>,
        request: Request
      ): User | null => {
        void request; // Ignore request
        if (
          credentials.password === "password" &&
          credentials.email === "bob@example.com"
        ) {
          return {
            email: "bob@example.com",
            name: "Bob",
            image: null,
          } satisfies User;
        }
        return null;
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
});
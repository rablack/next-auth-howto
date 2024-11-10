// This file creates and exports the basic authConfig.
// The basic authConfig is used directly by middleware,
// and it is extended for client-server use in auth.ts

// The reason that the configuration is split into two
// parts like this is that middleware typically runs on
// edge servers with a cut down environment and often no
// database access. The database adapter used on the
// server may not be available.

import { Account, NextAuthConfig, Profile, Session, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

interface JwtParams {
  token: JWT;
  user: User | AdapterUser;
  account: Account | null;
  profile?: Profile;
  trigger?: "signIn" | "signUp" | "update";
  isNewUser?: boolean;
  session?: unknown;
}

interface SessionParams {
  session: Session;
  token: JWT;
}

interface SignInParams {
  user: User;
  account: Account | null;
  profile?: Profile;
}

export const authConfig = {
  callbacks: {
    jwt({ token, user }: JwtParams): JWT | null {
      if (user) {
        token.id = user.id;
      }
      console.log("Token:", token);
      console.log("User:", user);
      return token;
    },
    session({ session, token }: SessionParams): Session {
      console.log("Start:", session);
      if (typeof token.id === "string" && session.user) {
        session.user.id = token.id;
      }
      console.log("Finish:", session);
      return session;
    },
    signIn({ user, account, profile }: SignInParams): boolean | string {
      console.log("Sign in by", user, account, profile);
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

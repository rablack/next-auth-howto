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
import { NextRequest, NextResponse } from "next/server";

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

interface RedirectParams {
  url: string;
  baseUrl: string;
}

interface AuthorizedParams {
  request: NextRequest;
  auth: Session | null;
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
    async redirect({ url, baseUrl }: RedirectParams): Promise<string> {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
    // Note that the authorized callback can be called as part of
    // handling the middleware.
    //
    // Return true for successfully authorized,
    // false to deny access (shows login box), or
    // a NextResponse to deny access with additional
    // control such as redirecting the URL.
    authorized({ request, auth }: AuthorizedParams): boolean | NextResponse {
      const url = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const requiresLogin = url.pathname.startsWith("/profile");

      if (requiresLogin && !isLoggedIn) {
        return false; // Show a login screen
        // Alternatvely redirect to the home page as follows:
        // return NextResponse.redirect(new URL("/", url));
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
} satisfies NextAuthConfig;

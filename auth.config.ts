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
  user?: AdapterUser;
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

// An example of extending the information
// sent to the front-end by adding a field to contain
// the number of cats that they have.
export interface UserWithCats extends User {
  cats?: number;
}

export interface SessionWithCats extends Session {
  user?: UserWithCats;
}

export const authConfig = {
  callbacks: {
    // Called when a web token is about to be created
    // or updated. The returned data will be included
    // in the token.
    // https://authjs.dev/reference/core#jwt
    jwt({ token, user, account }: JwtParams): JWT | null {
      if (user) {
        token.id = user.id;
        console.log("JWT Token:", token);
        console.log("JWT User:", user);
        console.log("JWT Account:", account);
      }
      return token;
    },
    // https://authjs.dev/reference/core#session
    // On the server, construct the session information to be
    // passed to the front-end (RSC or client component).
    session({ session, token, user }: SessionParams): SessionWithCats {
      // In the JWT strategy user (the database user) is not used
      void user;
      const newSession: SessionWithCats = structuredClone(session);
      if (typeof token.id === "string" && newSession.user) {
        newSession.user.id = token.id;
        // You can pass extra properties to the client
        newSession.user.cats = 4;
      }
      console.log("Session:", session);
      return newSession;
    },
    // https://authjs.dev/reference/core#signin
    // Verify that the user is allowed to sign in. For example check
    // the blacklist
    async signIn({
      user,
      account,
      profile,
    }: SignInParams): Promise<boolean | string> {
      const blacklist = ["chad@example.com"];
      const email = profile?.email || user.email || "";

      if (
        blacklist.find((item) => {
          return email === item;
        })
      ) {
        console.log("User blacklisted:", email);
        return false;
      }
      console.log(
        "Sign in by",
        email,
        user,
        ", account:",
        account,
        ", provider profile:",
        profile
      );
      return true;
    },
    // From https://authjs.dev/reference/core#redirect
    // When a call using a redirect URL is made (e.g. signIn)
    // there is an opportunity to rewrite the URL.
    async redirect({ url, baseUrl }: RedirectParams): Promise<string> {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;

      return baseUrl;
    },
    // Note that the authorized() callback can be called as part of
    // handling the middleware.
    //
    // Return true for successfully authorized,
    // false to deny access (shows login box), or
    // a NextResponse to deny access with additional
    // control such as redirecting the URL.
    // https://authjs.dev/reference/nextjs#authorized
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
    // The Credentials provider won't persist data in a database.
    // If we want to use Credentials in testing and OAuth in
    // production, using the JWT strategy keeps them similar.
    //
    // If you want to use strategy: "database", one way to do
    // it is to test with OAuth proxied through a site with a stable
    // URL ().
    // See https://authjs.dev/getting-started/deployment#securing-a-preview-deployment
    strategy: "jwt",
  },
  // Providers get added in auth.ts
  // https://authjs.dev/guides/edge-compatibility#split-config
  providers: [],
} satisfies NextAuthConfig;

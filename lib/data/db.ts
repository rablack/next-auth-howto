// This file is a static read-only database to avoid
// having to configure a real database for a simple
// example.
//
// Use this file to understand how a Credentials login
// in a test environment can work. You probably won't
// want to implement it this way.

import { User } from "next-auth";

interface DbLogin {
  email: string;
  id: string;
  provider: string;
  // In a real system we obviously wouldn't store
  // passwords as plaintext
  password?: string;
}

const dbLogins: DbLogin[] = [
  {
    email: "bob@example.com",
    id: "7a833df8-b73f-48fd-8962-07401c86c95e",
    provider: "credentials",
    password: "passwordb",
  },
  {
    email: "alice@example.com",
    id: "414c9133-dffc-490e-88f1-baa3fc3c41e2",
    provider: "credentials",
    password: "passworda",
  },
  {
    email: "chad@example.com",
    id: "75c6ca5e-6578-462c-8af3-f8e5e3ede681",
    provider: "credentials",
    password: "passwordc",
  },
];

interface DbUserProfile {
  id: string;
  name: string;
  pictureUrl: string | null;
  cats: number;
}

const dbUserProfiles: DbUserProfile[] = [
  {
    id: "7a833df8-b73f-48fd-8962-07401c86c95e",
    name: "Bob",
    pictureUrl: null,
    cats: 2,
  },
  {
    id: "414c9133-dffc-490e-88f1-baa3fc3c41e2",
    name: "Alice",
    pictureUrl: null,
    cats: 42,
  },
  {
    id: "75c6ca5e-6578-462c-8af3-f8e5e3ede681",
    name: "Chad",
    pictureUrl: null,
    cats: 0,
  },
];

export async function dbCheckCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<User | null> {
  const login = dbLogins.find((item: DbLogin): boolean => {
    return email === item.email && "credentials" === item.provider;
  });

  // Always do the compare regardless of whether
  // we matched a valid login
  const passwordValid = password === (login?.password || "nonsense");
  if (!login || !passwordValid) {
    return null;
  }
  const profile = dbUserProfiles.find((item: DbUserProfile): boolean => {
    return login.id.localeCompare(item.id) === 0;
  });
  const user: User = {
    email: email,
    id: login.id,
    image: profile?.pictureUrl,
    name: profile?.name || email,
  };

  return user;
}

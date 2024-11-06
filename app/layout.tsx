import type { Metadata } from "next";

import "@/styles/globals.css";
import NavBar from "@/components/nav/NavBar";

export const metadata: Metadata = {
  title: "NextAuth HowTo App",
  description: "Example app showing use of Auth.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}

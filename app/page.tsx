import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;
  const name = user?.name || "World";

  return (
    <main className="flex flex-row gap-8 justify-center sm:items-start">
      <h1 className="p-4 text-2xl">Hello {name}!</h1>
    </main>
  );
}

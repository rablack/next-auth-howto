import { auth } from "@/auth";
import { SessionWithCats } from "@/auth.config";
import ProfileDetails from "@/components/user/ProfileDetails";
import { SessionProvider } from "next-auth/react";

const ProfilePage = async () => {
  // Example of accessing the session on the server
  const session: SessionWithCats | null = await auth();
  const user = session?.user;
  const name = user?.name || "Nobody";
  const cats = user?.cats || "None";

  return (
    // Provide the session to the client-side
    // useSession() hook
    // in @/components/user/ProfileDetails.tsx
    <SessionProvider>
      <main className="">
        <div className="flex gap-8 justify-center sm:items-start">
          <h1 className="p-4 text-2xl">Profile of {name}</h1>
        </div>
        {user?.name && <ProfileDetails />}
        <div className="flex gap-8 justify-center sm:items-start">
          <p className="">(Cats on server: {cats})</p>
        </div>
      </main>
    </SessionProvider>
  );
};

export default ProfilePage;

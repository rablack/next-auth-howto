import { auth } from "@/auth";
import ProfileDetails from "@/components/user/ProfileDetails";
import { SessionProvider } from "next-auth/react";

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user;
  const name = user?.name || "Nobody";

  return (
    <main className="">
      <div className="flex gap-8 justify-center sm:items-start">
        <h1 className="p-4 text-2xl">Profile of {name}</h1>
      </div>
      <SessionProvider>{user?.name && <ProfileDetails />}</SessionProvider>
    </main>
  );
};

export default ProfilePage;

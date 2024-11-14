import { auth, signIn, signOut } from "@/auth";
import Link from "next/link";

const LoginLogoutBar = async () => {
  // Access the session from a server component
  const session = await auth();
  const user = session?.user;
  return (
    <div className="flex gap-4">
      {!!user?.name ? (
        <>
          <Link href="/profile">{user.name}</Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit">Logout</button>
          </form>
        </>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn();
          }}
        >
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default LoginLogoutBar;

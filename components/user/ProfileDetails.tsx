"use client";
// Illustrate use of useSession to access details of the
// session on the client. Note the SessionProvider wrapper
// in the corresponding server component
// (@/app/profile/page.tsx)
import { useSession } from "next-auth/react";

const ProfileDetails = () => {
  const session = useSession();
  const user = session.data?.user;
  return (
    <div className="flex justify-center">
      <table>
        <tbody>
          {user &&
            Object.entries(user).map((entry) => {
              const capName =
                entry[0].charAt(0).toUpperCase() + entry[0].slice(1);
              return (
                <tr key={entry[0]}>
                  <td className="justify-self-end px-4">{capName}</td>
                  <td className="px-4">{entry[1] || "null"}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileDetails;

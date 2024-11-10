import Link from "next/link";
import LoginLogoutBar from "./LoginLogoutBar";

interface NavLink {
  name: string;
  href: string;
}

const links: NavLink[] = [{ name: "Home", href: "/" }];

const NavBar = () => {
  return (
    <div className="flex justify-center">
      <div className="flex p-4 border-white border-2 max-w-3xl flex-auto justify-between">
        <div className="flex gap-4 flex-row flex-auto">
          {links.map((link) => {
            return (
              <Link key={link.name} href={link.href}>
                <p>{link.name}</p>
              </Link>
            );
          })}
        </div>
        <LoginLogoutBar />
      </div>
    </div>
  );
};

export default NavBar;

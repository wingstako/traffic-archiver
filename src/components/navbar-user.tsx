import { getServerAuthSession } from "~/server/auth";
import { signOut } from "next-auth/react";
import SignOutButton from "./sign-out";
import SignInButton from "./sign-in";

const NavbarUser = async () => {

  const session = await getServerAuthSession();

  return (
    <>
      <ul className="menu menu-horizontal px-1">
        {!session && (
          <li>
            <SignInButton />
          </li>
        )
        }
        {
          session && (
            <li>
              <details>
                <summary>
                  {session?.user.name}
                </summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  <li>
                    <SignOutButton />
                  </li>
                </ul>
              </details>
            </li>
          )
        }
      </ul>
    </>
  );
};

export default NavbarUser;

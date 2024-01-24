import { getServerAuthSession } from "~/server/auth";
import SignOutButton from "./sign-out";
import SignInButton from "./sign-in";

const NavbarUser = async () => {

  const session = await getServerAuthSession();

  return (
    <>

      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-secondary">
          {!session && (
            <SignInButton />
          )}
          {session?.user.name}
        </div>
        {session &&
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box">
            <li>
              <SignOutButton />
            </li>
          </ul>
        }
      </div>
    </>
  );
};

export default NavbarUser;

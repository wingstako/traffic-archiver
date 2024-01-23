
import { Session } from "next-auth";
import NavbarUser from "~/components/navbar-user";
import SignInButton from "~/components/sign-in";
import { getServerAuthSession } from "~/server/auth";
import "~/styles/globals.css";

export const metadata = {
  title: "Traffic Archiver",
  description: "Traffic Archiver for Github Repositories",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session: Session | null = await getServerAuthSession();

  return (
    <html lang="en">
      <body>
        <header className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Traffic Archiver</a>
          </div>
          <div className="flex-none">
              <NavbarUser></NavbarUser>
          </div>
        </header>
        <div className="flex">
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

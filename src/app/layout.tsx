
import NavbarUser from "~/components/navbar-user";
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

  return (
    <html lang="en">
      <body>
        <header className="navbar bg-base-100">
          <div className="navbar-start">
            <a href="/" className="btn btn-ghost text-xl">Traffic Archiver</a>
          </div>
          <div className="navbar-center">
          </div>
          <div className="navbar-end">
            <a href="/repos" className="btn btn-ghost content-center">Repositories</a>
            <NavbarUser></NavbarUser>
          </div>
        </header>
        <div className="py-4 px-4 mx-auto max-w-screen-xl lg:px-6">
          <main className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-400">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

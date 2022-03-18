import Link from "next/link";
import Account from "./Account/Account";

export default function Layout({ children, home }) {
  return (
    <div>
      <nav className="container bg-gray-300 py-5">
        <Account />
      </nav>
      <main>{children}</main>
      {!home && (
        <div>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  );
}

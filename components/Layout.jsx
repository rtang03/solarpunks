import Link from "next/link";
import Account from "./Account/Account";
import { useMoralis } from "react-moralis";
import Authenticate from "../components/Lens/Authenicate";
import { useContext } from "react";
import LensContext from "./LensContext";

const Layout = ({ children, home }) => {
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);

  return (
    <div>
      <nav className="container bg-gray-300 py-5">
        <Account />
        {account && isAuthenticated && <Authenticate />}
        {account && isAuthenticated && isLensReady && (
          <>
            <Link href="/dashboard">
              <span className="mx-2">
                <button className="border-2 p-2">
                  <a>Dashboard</a>
                </button>
              </span>
            </Link>
            <Link href="/profiles">
              <span className="mx-2">
                <button className="border-2 p-2">
                  <a>Profiles</a>
                </button>
              </span>
            </Link>
            <Link href="/profiles/create-profile">
              <span className="mx-2">
                <button className="border-2 p-2">
                  <a>Create Profile</a>
                </button>
              </span>
            </Link>
          </>
        )}
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;

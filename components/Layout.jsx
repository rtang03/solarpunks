import Link from "next/link";
import Account from "./Account/Account";
import { useMoralis } from "react-moralis";
import Authenticate from "../components/Lens/Authenicate";
import { useContext, useEffect } from "react";
import LensContext from "./LensContext";
import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "../graphql/getProfiles";

const Layout = ({ children, home }) => {
  const { account, isAuthenticated } = useMoralis();
  const {
    isLensReady,
    defaultProfile,
    defaultHandle,
    setDefaultProfile,
    setDefaultHandle,
    fetchDefaultProfileCount,
    setFetchDefaultPofileCount,
  } = useContext(LensContext);

  /**
   * Fetch default profile once
   */
  const FUNC = "profiles";
  const { data, error } = useQuery(GET_PROFILES, {
    variables: { request: { limit: 1, ownedBy: account } },
    skip: defaultProfile.startsWith("0x") || fetchDefaultProfileCount !== 0 || !account,
  });
  const profileId = data?.[FUNC]?.items?.[0]?.id;
  const handle = data?.[FUNC]?.items?.[0]?.handle;
  useEffect(() => {
    if (profileId) {
      setDefaultProfile(profileId);
      setDefaultHandle(handle);
      setFetchDefaultPofileCount(fetchDefaultProfileCount + 1);
    }
  }, [data]);
  error && console.error("fail fetch default profile", error);

  const user = defaultProfile && defaultHandle && `${defaultHandle}#${defaultProfile}`;

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

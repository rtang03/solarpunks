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
  const { data, error, refetch } = useQuery(GET_PROFILES, {
    variables: { request: { limit: 1, ownedBy: account } },
    skip: fetchDefaultProfileCount !== 0 || !account,
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

  // handling when switching metamask accounts
  useEffect(() => {
    if (account) {
      setFetchDefaultPofileCount(0);
      refetch();
    }
  }, [account]);

  error && console.error("fail fetch default profile", error);

  return (
    <div>
      <nav className="top-hud">
        <Account />
        {account && isAuthenticated && <Authenticate />}
        {account && isAuthenticated && isLensReady && (
          <Link href="/dashboard">
            <a className="hud3">Dashboard</a>
          </Link>
        )}
        {account && isAuthenticated && isLensReady && (
          <Link href="/profiles">
            <a className="hud3">Profiles</a>
          </Link>
        )}
        {account && isAuthenticated && isLensReady && (
          <Link href={`/profiles/${defaultHandle}/publications/create-post`}>
            <a className="hud4">Create Post</a>
          </Link>
        )}
      </nav>
      <main>{children}</main>
      <nav className="bottom-hud">
        {account && <div className="huda"> 🔥 Gas</div>}
        {account && isAuthenticated && isLensReady && (
          <Link href="/profiles/create-profile">
            <a className="hud3">Create Profile</a>
          </Link>
        )}

        {account && isAuthenticated && isLensReady && (
          <Link href={`/profiles/${defaultHandle}/timeline`}>
            <a className="hud3">Timeline</a>
          </Link>
        )}
        {/* {account && isAuthenticated && isLensReady && (
          <Link href="/explore">
            <a>Explore</a>
          </Link>
        )} */}
        {account && <div className="hudb"> ⚡ Energy</div>}
        {account && <div className="hudb"> 💽 Chips</div>}
        {account && <div className="hudc"> 🪨 Carbon</div>}
      </nav>
    </div>
  );
};

export default Layout;

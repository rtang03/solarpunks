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
      <nav className="top-hud">
        <Account />
        {account && isAuthenticated && <Authenticate />}
        {account && isAuthenticated && isLensReady && (
          <a class="hud3" href="/dashboard">Dashboard</a>)}
        {account && isAuthenticated && isLensReady && (  
          <a class="hud3" href="/profiles">Profiles</a>)}
        {account && isAuthenticated && isLensReady && (
        <a class="hud4" href="/profiles/create-profile">Create Profile</a>)}
          <Link href={`/profiles/${defaultHandle}/publications/create-post`}>
              <span className="mx-2">
                <button className="border-2 p-2">
                  <a>Create Post</a>
                </button>
              </span>
            </Link>
            <Link href={`/profiles/${defaultHandle}/timeline`}>
              <span className="mx-2">
                <button className="border-2 p-2">
                  <a>Timeline</a>
                </button>
              </span>
            </Link>
      </nav>
      <main>{children}</main>
      <nav class="bottom-hud">
      {account && (<div class="huda"> 🔥 Gas</div>)} 
      {account && (<div class="hudb"> ⚡ Energy</div>)}
      {account && (<div class="hudb"> 💽 Chips</div>)}
      {account && (<div class="hudc"> 🪨 Carbon</div>)}  
    </nav>
    </div>
  );
};

export default Layout;

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
          <a class="hud3" href="/dashboard">Dashboard</a>)}
        {account && isAuthenticated && isLensReady && (  
          <a class="hud3" href="/profiles">Profiles</a>)}
        {account && isAuthenticated && isLensReady && (
        <a class="hud4" href={`/profiles/${defaultHandle}/publications/create-post`}>Create Post</a>)}
      </nav>
      <main>{children}</main>
      <nav class="bottom-hud">
      {account && (<div class="huda"> 🔥 Gas</div>)} 
      {account && isAuthenticated && isLensReady && (
      <a class="hud3" href="/profiles/create-profile">Create Profile</a>)}
      
        {account && isAuthenticated && isLensReady && (
        <a class="hud3" href={`/profiles/${defaultHandle}/timeline`}>Timeline</a>)}
        {account && isAuthenticated && isLensReady && (
        <a href="/explore">Explore</a>)}
        {account && isAuthenticated && isLensReady && (
        <a href={`/profiles/${defaultHandle}/timeline`}>Timeline</a>)}
      {account && (<div class="hudb"> ⚡ Energy</div>)}
      {account && (<div class="hudb"> 💽 Chips</div>)}
      {account && (<div class="hudc"> 🪨 Carbon</div>)}  
    </nav>
    </div>
  );
};

export default Layout;

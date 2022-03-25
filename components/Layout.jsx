import Link from "next/link";
import Account from "./Account/Account";
import { useMoralis } from "react-moralis";
import Authenticate from "../components/Lens/Authenicate";
import { useContext, useEffect, Fragment } from "react";
import LensContext from "./LensContext";
import { useQuery } from "@apollo/client";
import { GET_PROFILES } from "../graphql/getProfiles";
import { Menu, Transition } from "@headlessui/react";

const MyLink = props => {
  const { href, children, ...rest } = props;

  return (
    <div className="text-center m-2 p-2">
      <Link href={href}>
        <a {...rest}>{children}</a>
      </Link>
    </div>
  );
};

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
        {/* {account && isAuthenticated && isLensReady && (
          <Link href="/profiles">
            <a className="hud3">Profiles</a>
          </Link>
        )} */}
        {account && isAuthenticated && isLensReady && (
          <Menu>
            <Menu.Button className="hud3">Profiles</Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-48 mt-48 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-green-500 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <MyLink className={`${active && "bg-blue-500"}`} href="/profiles">
                      My Profiles
                    </MyLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MyLink
                      className={`${active && "bg-blue-500"}`}
                      href="/profiles/create-profile"
                    >
                      Create Profile
                    </MyLink>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
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
          <Link href="/explore">
            <a className="hud3">Explore</a>
          </Link>
        )}

        {account && isAuthenticated && isLensReady && (
          <Link href={`/profiles/${defaultHandle}/timeline`}>
            <a className="hud3">Timeline</a>
          </Link>
        )}
        {account && <div className="hudb"> ⚡ Energy</div>}
        {account && <div className="hudc"> 💽 Chips</div>}
      </nav>
    </div>
  );
};

export default Layout;

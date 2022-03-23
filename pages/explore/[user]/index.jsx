import Layout from "../../../components/Layout";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import LensContext from "../../../components/LensContext";
import { useMoralis } from "react-moralis";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import Profile from "../../../components/Profile";
import Timeline from "../../../components/Timeline";
import includes from "lodash/includes";
import slice from "lodash/slice";
import Link from "next/link";

const PublicUserPage = () => {
  const { friendList, setFriendList, isLensReady, last5VisitProfiles, setLast5VisitProfiles } =
    useContext(LensContext);
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();

  // user in pathname may be incorrectly typed
  const { user } = router.query;
  const [handle, profileId] = user.split("#");
  const isValidUser = !!handle && !!profileId;

  // guess is a valdiated user name
  const guess = isValidUser && user;

  // when guess is not in last5VisitProfiles
  useEffect(() => {
    if (guess && !includes(last5VisitProfiles, guess)) {
      if (last5VisitProfiles.length >= 5) {
        setLast5VisitProfiles([guess, ...slice(last5VisitProfiles, 0, 4)]);
      } else {
        setLast5VisitProfiles([guess, ...last5VisitProfiles]);
      }
    }
  }, [setLast5VisitProfiles, last5VisitProfiles, guess]);

  return (
    <Layout>
      {!(account && isAuthenticated) && <ConnectWalletMessage />}
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <>
          {!isValidUser ? (
            <div>Malformed username; (e.g. john#0x01)</div>
          ) : (
            <div>
              <span className="m-2">
                <button className="bg-blue-200 m-2 p-2">
                  <Link href={`/explore`}>
                    <a>Go to explore page</a>
                  </Link>
                </button>
              </span>
              <div>PROFILE</div>
              <Profile handle={handle} guessOnly={true} />
              <button className="border-2 bg-blue-300 m-2 p-2">
                <Link href={`/explore/${user.replace("#", "%23")}/follow`}>
                  <a>Follow {handle}</a>
                </Link>
              </button>
              <Timeline profileId={profileId} showLinkToPublicProfile={true} />
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default PublicUserPage;

import { useQuery } from "@apollo/client";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";
import Layout from "../../../components/Layout";
import LensContext from "../../../components/LensContext";
import { useRouter } from "next/router";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { SEARCH } from "../../../graphql/search";
import Timeline from "../../../components/Timeline";
import NoRecord from "../../../components/NoRecord";

const TimelinePage = () => {
  const FUNC = "search";
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);
  const router = useRouter();
  const handle = router.query.handle;

  // search profile based on pathname
  const { loading, data, error } = useQuery(SEARCH, {
    variables: { request: { query: handle, type: "PROFILE" } },
    skip: !handle,
  });

  error && console.error("error in searching profile: ", error);

  const profileId = data?.[FUNC]?.items?.[0].profileId;

  return (
    <Layout>
      {!(account && isAuthenticated) && <ConnectWalletMessage />}
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <>{profileId ? <Timeline profileId={profileId} showComment={true} /> : <NoRecord />}</>
      )}
    </Layout>
  );
};

export default TimelinePage;

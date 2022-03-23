import { gql, useQuery } from "@apollo/client";
import { useMoralis } from "react-moralis";
import { useContext } from "react";
import { useRouter } from "next/router";
import ConnectWalletMessage from "../../../../../components/ConnectWalletMessage";
import Layout from "../../../../../components/Layout";
import LensContext from "../../../../../components/LensContext";
import Collect from "../../../../../components/Collect";
// import { shortenAddress } from "../../../../../lib/shortenAddress";
import Link from "next/link";

const CollectPage = () => {
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady, defaultProfile } = useContext(LensContext);
  const router = useRouter();
  const { user, publicationid } = router.query;
  const [handle, profileId] = user.split("#");

  const { data, loading, error } = useQuery(HAS_COLLECTED, {
    variables: {
      request: { collectRequests: { walletAddress: account, publicationIds: [publicationid] } },
    },
    skip: !account,
  });

  const result = data?.hasCollected?.[0].results?.[0];
  const walletAddress = data?.hasCollected?.[0].walletAddress;
  const collected = result?.collected;
  const collectedTimes = result?.collectedTimes;
  const canCollect = publicationid === result?.publicationId && !collected && collectedTimes === 0;

  error && console.error("fail to query HasCollected: ", error);

  return (
    <Layout>
      {account && isAuthenticated ? (
        <>
          {isLensReady && (
            <div>
              {loading && <div>...loading</div>}
              <div>
                <Link href={`/explore/${handle}%23${profileId}/timeline`}>
                  <button className="border-2 p-2 bg-blue-300">
                    <a>Back to timeline</a>
                  </button>
                </Link>
              </div>
              <div>
                <Link href={`/explore/${handle}%23${profileId}/publications/${publicationid}`}>
                  <button className="border-2 p-2 bg-blue-300">
                    <a>Back to publication details</a>
                  </button>
                </Link>
              </div>
              {data && (
                <div className="m-5 border-2">
                  This item is{" "}
                  {collected ? `collected for ${collectedTimes} times` : "not collected"}, by
                  {walletAddress}
                </div>
              )}
              {canCollect ? (
                <Collect user={user} publicationid={publicationid} />
              ) : (
                <div>cannot be collected</div>
              )}
            </div>
          )}
        </>
      ) : (
        <ConnectWalletMessage />
      )}
    </Layout>
  );
};

export default CollectPage;

const HAS_COLLECTED = gql`
  query ($request: HasCollectedRequest!) {
    hasCollected(request: $request) {
      walletAddress
      results {
        collected
        publicationId
        collectedTimes
      }
    }
  }
`;

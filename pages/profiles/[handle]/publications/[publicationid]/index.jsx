import { useRouter } from "next/router";
import Layout from "../../../../../components/Layout";
import Publication from "../../../../../components/Publication";
import ConnectWalletMessage from "../../../../../components/ConnectWalletMessage";
import { useMoralis } from "react-moralis";

const PublicationPage = () => {
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();
  const { handle, publicationid } = router.query;

  return (
    <Layout>
      {!(account && isAuthenticated) && <ConnectWalletMessage />}
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <>
          {!isValidUser ? (
            <div>Malformed username; (e.g. john#0x01)</div>
          ) : (
            <>
              <Publication handle={handle} publicationId={publicationid} />
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default PublicationPage;

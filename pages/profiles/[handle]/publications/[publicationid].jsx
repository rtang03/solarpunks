import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import Publication from "../../../../components/Publication";
import { useMoralis } from "react-moralis";

const PublicationPage = () => {
  const { account, isAuthenticated } = useMoralis();
  const router = useRouter();
  const { handle, publicationid } = router.query;

  return (
    <Layout>
      {account && isAuthenticated ? (
        <>
          <Publication handle={handle} publicationId={publicationid} />
        </>
      ) : (
        <ConnectWalletMessage />
      )}
    </Layout>
  );
};

export default PublicationPage;

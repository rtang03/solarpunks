import { useMoralis } from "react-moralis";
import Layout from "../../../components/Layout";
import Publications from "../../../components/Publications";
import ConnectWalletMessage from "../../../components/ConnectWalletMessage";

const PublicationPage = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout>{account && isAuthenticated ? <Publications /> : <ConnectWalletMessage />}</Layout>
  );
};

export default PublicationPage;

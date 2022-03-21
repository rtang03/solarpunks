import Profiles from "../../components/Profiles";
import Layout from "../../components/Layout";
import ConnectWalletMessage from "../../components/ConnectWalletMessage";
import { useMoralis } from "react-moralis";

const ProfilesPage = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout>
      {account && isAuthenticated ? <Profiles dev={true} /> : <ConnectWalletMessage />}
    </Layout>
  );
};

export default ProfilesPage;

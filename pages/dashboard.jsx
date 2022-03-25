import Layout from "../components/Layout";
import ConnectWalletMessage from "../components/ConnectWalletMessage";
import LensContext from "../components/LensContext";
import { useContext } from "react";
import Link from "next/link";
import { useMoralis } from "react-moralis";

const Dashboard = () => {
  const { friendList, setFriendList, isLensReady } = useContext(LensContext);
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout>
      {!(account && isAuthenticated) && <ConnectWalletMessage />}
      {!(account && isAuthenticated && isLensReady) && <div>Lens is not active</div>}
      {account && isAuthenticated && isLensReady && (
        <div className="MainScreen">
          <div className="MainBoard">
            <div className="Board1 divide-y-2">
              <div className="my-5">Friends</div>
              <div className="text-md py-2">
                {friendList?.map((friend, index) => (
                  <div key={index}>
                    <Link href={`/explore/${friend.replace("#", "%23")}`}>
                      <a>{friend}</a>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className="Board2">Punk Cities Places</div>
            <div className="Board3">Feed</div>
            <div className="Board2">My post</div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;

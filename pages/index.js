import Layout from "../components/Layout";
import { useMoralis } from "react-moralis";
import Authenticate from "../components/Lens/Authenicate";
import Profiles from "../components/Lens/Profile/Profiles";
import CreateProfile from "../components/Lens/Profile/CreateProfile";
import { useState } from "react";

const Home = () => {
  const { account, isAuthenticated } = useMoralis();
  const [isLensAPIAuthenticated, setLensAPIAuthenticated] = useState(false);

  return (
    <Layout home={true}>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-2xl font-bold">Welcome to Decentralized Social</h1>
          {account && (
            <div className="m-5 border-2">
              1. LensApi Authenticate:
              <Authenticate authenicationCallback={setLensAPIAuthenticated} />
            </div>
          )}
          {account && isAuthenticated && isLensAPIAuthenticated && (
            <div className="m-5 border-2">
              2. Get Paginated Profiles: <Profiles />
            </div>
          )}
          {account && isAuthenticated && isLensAPIAuthenticated && (
            <div className="m-5 border-2">
              3. Create Profile
              <CreateProfile />
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Home;

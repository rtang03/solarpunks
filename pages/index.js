import Layout from "../components/Layout";
import { useMoralis } from "react-moralis";
import Authenticate from "../components/Lens/Authenicate";
import Profiles from "../components/Lens/Profile/Profiles";
import CreateProfile from "../components/Lens/Profile/CreateProfile";
import SearchProfile from "../components/Lens/Profile/SearchProfile";
import UpdateProfile from "../components/Lens/Profile/UpdateProfile";
import { useState } from "react";
import Publications from "../components/Lens/Publication/Publications";
import CreatePost from "../components/Lens/Publication/CreatePost";
import Publication from "../components/Lens/Publication/Publication";
import Follow from "../components/Lens/Follow/Follow";

// todo: for dev use only. fix later
const HARDCODE_HANDLE = "rtang3";

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
          {account && isAuthenticated && isLensAPIAuthenticated && (
            <div className="m-5 border-2">
              4. Search By Handle
              <SearchProfile />
            </div>
          )}
          {account && isAuthenticated && isLensAPIAuthenticated && (
            <div className="m-5 border-2">
              5. Update Profile
              <UpdateProfile handle={HARDCODE_HANDLE} />
            </div>
          )}
          {account && isAuthenticated && isLensAPIAuthenticated && (
            <div className="m-5 border-2">
              6. Get Paginated Publications
              <Publications />
            </div>
          )}
          {account && isAuthenticated && isLensAPIAuthenticated && (
            <div className="m-5 border-2">
              7. Create Post
              <CreatePost />
            </div>
          )}
          {account && isAuthenticated && isLensAPIAuthenticated && (
            <div className="m-5 border-2">
              8. Get 1x Publication
              <Publication />
            </div>
          )}
          {account && isAuthenticated && isLensAPIAuthenticated && (
            <div className="m-5 border-2">
              9. Follow profileId "x021" (switch to other account first)
              <Follow />
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Home;

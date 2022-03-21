import Layout from "../components/Layout";
import { useMoralis } from "react-moralis";
import CreateProfile from "../components/Lens/Profile/CreateProfile";
import SearchProfile from "../components/Lens/Profile/SearchProfile";
import UpdateProfile from "../components/Lens/Profile/UpdateProfile";
import { useContext } from "react";
import Publications from "../components/Lens/Publication/Publications";
import CreatePost from "../components/Lens/Publication/CreatePost";
import Publication from "../components/Lens/Publication/Publication";
import Follow from "../components/Lens/Follow/Follow";
import Followers from "../components/Lens/Follow/Followers";
import Following from "../components/Lens/Follow/Following";
import CreateComment from "../components/Lens/Publication/CreateComment";
import Collect from "../components/Lens/Module/Collect";
import Timeline from "../components/Lens/Timeline/Timeline";
import LensContext from "../components/LensContext";
import Link from "next/link";

// todo: for dev use only. fix later
const HARDCODE_HANDLE = "rtang3";

const Home = () => {
  const { account, isAuthenticated } = useMoralis();
  const { isLensReady } = useContext(LensContext);

  return (
    <Layout home={true}>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-2xl font-bold">Welcome to Decentralized Social</h1>
          {account && isAuthenticated && isLensReady && (
            <div className="m-5 border-2">
              3. Create Profile
              <CreateProfile />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              4. Search By Handle
              <SearchProfile />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              5. Update Profile
              <UpdateProfile handle={HARDCODE_HANDLE} />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              6. Get Paginated Publications
              <Publications />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              7. Create Post
              <CreatePost />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              8. Get 1x Publication
              <Publication />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              9. Follow profileId "x021" (switch to other account first)
              <Follow />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              10. Get Paginated Followers by profileId "x021"
              <Followers />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              11. Get Paginated Following by active wallet address
              <Following />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              12. Create Comment
              <CreateComment />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              13. Collect 0x21-0x08 by 0x59
              <Collect />
            </div>
          )}
          {account && isAuthenticated && (
            <div className="m-5 border-2">
              14. Get Timeline 0x21
              <Timeline />
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
};

export default Home;

import Layout from "../components/Layout";
import { useMoralis } from "react-moralis";
import Followers from "../components/Lens/Follow/Followers";
import Following from "../components/Lens/Follow/Following";
import CreateComment from "../components/Lens/Publication/CreateComment";
import Collect from "../components/Lens/Module/Collect";


const Home = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout home={true}>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-2xl font-bold">Welcome to Decentralized Social</h1>
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
        </main>
      </div>
    </Layout>
  );
};

export default Home;

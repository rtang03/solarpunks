import Layout from "../components/Layout";
import { useMoralis } from "react-moralis";

const Home = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout home={true}>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <h1 className="text-2xl font-bold">Welcome to Decentralized Social</h1>
        </main>
      </div>
    </Layout>
  );
};

export default Home;

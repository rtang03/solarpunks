import Layout from "../components/Layout";
import { useMoralis } from "react-moralis";
import Link from "next/link";

const Home = () => {
  const { account, isAuthenticated } = useMoralis();

  return (
    <Layout home={true}>
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        {/* <div className="mt-32">
          <Link href="/fetch">
            <a>Fetch</a>
          </Link>
        </div> */}
        <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
          <img
            src="https://punkcities.mypinata.cloud/ipfs/QmQjKTrUkUhtv9Luxm6zSxnzGoN92ABqFWTZHQAsxzXL4k"
            className="w-1/2"
          />
        </main>
      </div>
    </Layout>
  );
};

export default Home;
